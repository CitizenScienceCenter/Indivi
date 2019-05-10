

const findPartCategory = (data_noH, headers, topicConfig, partId) => { 
    // define the formulas for average and MSSD
    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length; // generic function to compute average
    const mssd = arr => {
        const square_diffs = []
        for (let i=0; i < arr.length-1; i++) {
            const square_diff = (arr[i] - arr[i+1])*(arr[i] - arr[i+1]);
            square_diffs.push(square_diff);
        }
        return arrAvg(square_diffs.map(Number))
    }
    
    // find the index in the data set
    const varIndex = headers.indexOf(topicConfig.variable); // find the index of the variable
    const topicIdIndex = headers.indexOf(topicConfig.id);// find the index of the partId
    const timeIndex = headers.indexOf(topicConfig.time);

    // get a list with all ids (unique)
    const all_ids = [];
    data_noH.map(line => {
        all_ids.push(line[topicIdIndex]);
        return all_ids;
    });
    const all_unique_ids = [...new Set(all_ids)]

    let ownValue; // own average / MSSD
    const allValues = []; // array with the average/MSSD for each participant
    
    // if there is a time component, compute MSSD instead of average
    if (topicConfig.time !== ''){ 
        all_unique_ids.map(id => {
            let id_timeVal_dict = [];
            data_noH.map(line => {
                if (line[topicIdIndex] === id) {
                    const timeVal_dict = {time: line[timeIndex], val: line[varIndex]}
                    id_timeVal_dict.push(timeVal_dict);}
                return id_values;
            });
            id_timeVal_dict = id_timeVal_dict.sort(function(a, b){return a.time-b.time}); // sort the id_timeVal_dict according to time
            const id_values = [];
            id_timeVal_dict.map(dict => id_values.push(dict.val))
            const id_mssd = mssd(id_values); // average of the values for the participant of interest
            allValues.push(id_mssd)
            if (id === partId) {ownValue = id_mssd}
            return id_mssd;
        })
    }
    else { // compute normal average
        all_unique_ids.map(id => {
            const id_values = [];
            data_noH.map(line => {
                if (line[topicIdIndex] === id) {
                    id_values.push(line[varIndex]);}
                return id_values;
            });
            const id_avg = parseFloat(arrAvg(id_values.map(Number))); // average of the values for the participant of interest
            allValues.push(id_avg)
            if (id === partId) {ownValue = id_avg}
            return id_avg;
        })
    }
    /////

    //// generic function to compute the percentile
    const percentile = (array, perc) => {
        const sorted = array.sort((a, b) => (a - b));
        const position = sorted.length * perc - 1; // the position of the percentile in the array
        const base = Math.floor(position);
        const rest = parseFloat(position - base);
        if( (sorted[base+1]!== undefined) ) {
            return parseFloat(sorted[base]) + parseFloat(rest * (parseFloat(sorted[base+1]) - parseFloat(sorted[base])));
          } else {
            return parseFloat(sorted[base]);}
    }
    ////

    if (ownValue > percentile(allValues, .75)) {
        return "textHigh";
    } else if (ownValue <= percentile(allValues, .75) && ownValue >= percentile(allValues, .25)) {
        return "textMiddle";
    } else if (ownValue < percentile(allValues, .25)) {
        return "textLow";
    } 
    else {
        return "No data";
    }
}

export default findPartCategory;