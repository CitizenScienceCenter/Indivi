import * as math from 'mathjs';

const prepLinePlotData = (data_noH, headers, partId, topicConfig, dyad, groupComp) => {        
    const variableName = topicConfig.variable;
    const time = topicConfig.time;
    const timeName = topicConfig.timeName;
    const groupName = topicConfig.group;
    const var2 = topicConfig.variable2;
    const var3 = topicConfig.variable3;

    const varIndex = headers.indexOf(variableName); // find the index of the variable
    const idIndex = headers.indexOf(topicConfig.id);// find the index of the partId
    const timeIndex = headers.indexOf(time);
    const timeNameIndex = headers.indexOf(timeName)
    const groupIndex = headers.indexOf(groupName);

    ///// variables needed for the state
    const timeValues = [];
    let time_dict = [];
    const ownValues = [];
    const allValues = [];
    data_noH.map(line => {
        if (line[idIndex] === partId) {
            ownValues.push(line[varIndex]);}
        time_dict.push({time: line[timeIndex], timeName: line[timeNameIndex]})
        allValues.push(line[varIndex]);
        return timeValues.push(line[timeIndex]);
    });
    time_dict = time_dict.sort(function(a, b){return a.time-b.time}); // sort the id_timeVal_dict according to time
    const uniqueTimes = [...new Set(time_dict.map(dict => dict.time))]// eliminate duplicates (have each time entry only once)
    const uniqueTimeNames = [...new Set(time_dict.map(dict => dict.timeName))]// eliminate duplicates (have each time entry only once)
    
    let xaxis_label;
    let newTitle;

    if (topicConfig.timeName !== '') {xaxis_label = 
        {type: 'category',
        title: topicConfig.time,
        tickvals: uniqueTimes, 
        ticktext: uniqueTimeNames}}
    else {xaxis_label = 
        {type: 'category',
        title: topicConfig.time,
        }}


    const lp_data = []; // array of objects (one for each line) with x (array), y (array) and type: scatter 
    const newLayout = {
        width: 500, l:0, 
        height: 400, 
        // title: topicConfig.topicName, 
        showlegend: true,
        legend: {"orientation": "h",
                xanchor: "center",
                y: 1.2,
                x: 0.5},
        xaxis: xaxis_label,
        yaxis: {range: [Math.min(...allValues)*0.9, Math.max(...allValues)*1.1]},
        annotations: [],
        grid: {},
        shapes: []};
    const shapes = [];
    const annotations = [];
    let grid = {};

    //////// Time and Group (but not Dyad) (Type 6a)
    if (groupName !== '' && !dyad && var2 === '' && var3 === '') {
        let ownGroup;
        data_noH.map(line => { // get own group
            if (line[idIndex] === partId) {
                return ownGroup = (line[groupIndex]);}
            return ownGroup;
        });
        const groupValues = [];
        data_noH.map(line => {
            if (line[groupIndex] === ownGroup) {
                groupValues.push(line[varIndex]);}
            return groupValues;
        });
        
        lp_data.push({x: uniqueTimes, y: ownValues, type: "scatter", 
            name: "Ihre Werte", connectgaps: true});
        const groupMean = math.mean(groupValues);
        const groupSd = math.std(groupValues);
        
        const meanGroupLabel = "Mittelwert Ihrer Gruppe " + ownGroup;
        const bottomSdGroupLabel = "Typische Untergrenze Ihrer Gruppe " + ownGroup;
        const topSdGroupLabel = "Typische Obergrenze Ihrer Gruppe " + ownGroup;
        shapes.push({type: 'line', x0: uniqueTimes[0], x1: uniqueTimes[uniqueTimes.length-1], 
            y0: groupMean, y1: groupMean});
        annotations.push({text: meanGroupLabel, x: uniqueTimes[0], y: groupMean, 
            xanchor: 'left', yanchor: 'bottom', showarrow: false})
        shapes.push({type: 'line', x0: uniqueTimes[0], x1: uniqueTimes[uniqueTimes.length-1], 
            y0: groupMean-groupSd, y1: groupMean-groupSd, line: {dash: 'dot'}});
        annotations.push({text: bottomSdGroupLabel, x: uniqueTimes[0], y: groupMean-groupSd, 
            xanchor: 'left', yanchor: 'bottom', showarrow: false})
        shapes.push({type: 'line', x0: uniqueTimes[0], x1: uniqueTimes[uniqueTimes.length-1], 
            y0: groupMean+groupSd, y1: groupMean+groupSd, line: {dash: 'dot'}});
        annotations.push({text: topSdGroupLabel, x: uniqueTimes[0], y: groupMean+groupSd, 
            xanchor: 'left', yanchor: 'bottom', showarrow: false})

    } ///// End time and group

    /////// Time and Dyad (Type 6b)
    else if (groupName !== '' && dyad && var2 === '' && var3 === '') {
        const dyadId = dyad;
        const dyadIndex = headers.indexOf(groupName); // find the index of the dyadType
        const dyadTypes = []; // equivalent to all the values in the column group
        data_noH.map(line => { // populate group[] and get own group
            dyadTypes.push(line[dyadIndex]);
            return dyadTypes;
        });
        const uniquedyadTypes = [...new Set(dyadTypes)]; // eliminate duplicates
        
        const ownP1values = [];
        const ownP2values = [];
        data_noH.map(line => { 
            if (line[dyadIndex] === uniquedyadTypes[0]) {
                if (line[idIndex] === dyadId) {
                    ownP1values.push(line[varIndex]);}} 
            else if (line[dyadIndex] === uniquedyadTypes[1]) {
                if (line[idIndex] === dyadId) {
                    ownP2values.push(line[varIndex]);}}
            return data_noH;       
        });

        lp_data.push({x: uniqueTimes, y: ownP1values, type: "scatter", 
                name: uniquedyadTypes[0], connectgaps: true});
        lp_data.push({x: uniqueTimes, y: ownP2values, type: "scatter", 
                name: uniquedyadTypes[1], connectgaps: true});
    } ////// End Time and Dyad

    //////// Time and Multiple Variables (Type 7)
    else if (groupName === '' && (var2 !== '' || var3 !== '')) {
        const variables = [];
        variables.push(variableName);
        if (var2 !== '') {variables.push(var2);}
        if (var3 !== '') {variables.push(var3);}

        let yaxis_count = 2;
        variables.map((variable, index) => {
            const valuesVarX = []; // is used only within the loop
            const varXIndex = headers.indexOf(variable); // find the index of the current variable
            const ownValuesVarX = [];
            data_noH.map(line => {
                valuesVarX.push(line[varXIndex]) // all values of the current variable
                if (line[idIndex] === partId) {
                    ownValuesVarX.push(line[varXIndex]);}
                return valuesVarX;
            })

            let yaxis = 'y';
            if (index > 0) {
                const min_mainY = math.min(lp_data[0].y);
                const max_mainY = math.max(lp_data[0].y);
                const min_Y = math.min(ownValuesVarX);
                const max_Y = math.max(ownValuesVarX);
                if (min_Y < 2*min_mainY || min_Y > 2*min_mainY || max_Y < 2*max_mainY || max_Y > 2*max_mainY) {
                    yaxis = 'y' + yaxis_count;
                    yaxis_count = yaxis_count +1;
                }
            }

            lp_data.push({x: uniqueTimes, y: ownValuesVarX, type: "scatter", 
                name: variable, connectgaps: true, yaxis: yaxis});
            return lp_data;

        });
        newLayout.yaxis2 = {side: 'right', overlaying: 'y', zeroline: false, showticklabels: false, showgrid: false};
        newLayout.yaxis3 = {side: 'right', overlaying: 'y', anchor: 'free', zeroline: false, showticklabels: false, showgrid: false};
        newLayout.yaxis = {zeroline: false, showticklabels: false}
    } ////// End Time and Multiple Varialbes

    //////// Time and Group and Multiple Variables (no Dyad) (Type 8a)
    else if (groupName !== '' && !dyad && (var2 !== '' || var3 !== '')) {
        const variables = [];
        variables.push(variableName);
        if (var2 !== '') {variables.push(var2);}
        if (var3 !== '') {variables.push(var3);}

        let ownGroup;
        data_noH.map(line => { // get own group
            if (line[idIndex] === partId) {
                return ownGroup = (line[groupIndex]);}
            return ownGroup;
        });

        variables.map((variable, index) => {
            const varXIndex = headers.indexOf(variable); // find the index of the current variable
           
            const groupValuesX = [];
            const ownValuesVarX = [];
            data_noH.map(line => {
                if (line[groupIndex] === ownGroup) {
                    groupValuesX.push(line[varXIndex]);}
                if (line[idIndex] === partId) {
                    ownValuesVarX.push(line[varXIndex]);}
                return groupValuesX;
            });

            const varName = variable + ' (Ihre Werte)'
            let yaxis = 'y';
            let xaxis = 'x';
            if (index > 0) {
                yaxis = 'y' + (index+1);
                xaxis = 'x' + (index+1);}

            lp_data.push({x: uniqueTimes, y: ownValuesVarX, type: "scatter", 
                    xaxis: xaxis, yaxis: yaxis, name: varName, connectgaps: true});

            const groupMean = math.mean(groupValuesX);
            // const groupSd = math.std(groupValuesX);
            
            const meanGroupLabel = "Mittelwert Ihrer Gruppe " + ownGroup;
            //const bottomSdGroupLabel = "Typische Untergrenze Ihrer Gruppe " + ownGroup;
            //const topSdGroupLabel = "Typische Obergrenze Ihrer Gruppe " + ownGroup;
            shapes.push({type: 'line', x0: uniqueTimes[0], x1: uniqueTimes[uniqueTimes.length-1], 
                y0: groupMean, y1: groupMean, xref: xaxis, yref: yaxis});
            annotations.push({text: meanGroupLabel, x: uniqueTimes[0], y: groupMean, 
                xanchor: 'left', yanchor: 'bottom', xref: xaxis, yref: yaxis, 
                showarrow: false})

            if (variables.length === 2 && index === 0) {
                annotations.push({text: variable, showarrow: false, align: 'center',
                    xref: 'paper', yref: 'paper', x: 0, y: 0.55});}
            else if (variables.length === 3 && index === 0) {
                annotations.push({text: variable, showarrow: false, align: 'center',
                    xref: 'paper', yref: 'paper', x: 0, y: 0.36})}
            else if (variables.length === 3 && index === 1) {
                annotations.push({text: variable, showarrow: false, align: 'center',
                    xref: 'paper', yref: 'paper', x: 0, y: 0.72})}
            else {
                annotations.push({text: variable, showarrow: false, align: 'center',
                    xref: 'paper', yref: 'paper', x: 0, y: 1.1})}

            return lp_data;
            });
        let subplots;
        if (variables.length === 2) {subplots = ['xy', 'x2y2']}
        if (variables.length === 2) {subplots = ['xy', 'x2y2', 'x3y3']}
        grid = {rows: variables.length, columns: 1, subplots: subplots, 
                roworder: 'bottom to top'};
        newLayout.xaxis.zeroline = false;
        newLayout.xaxis2 = {showticklabels: false};
        newLayout.xaxis3 = {showticklabels: false};
        newLayout.yaxis.zeroline = false;
        newTitle = 'Für die Gruppe ' + ownGroup;
        newLayout.showlegend = false
    } ////// End Time and Group and Multiple Variables (no Dyad)

    //////// Time and Dyad and Multiple Variables (Type 8b)
    else if (groupName !== '' && dyad && (var2 !== '' || var3 !== '')) {
        const variables = [];
        variables.push(variableName);
        if (var2 !== '') {variables.push(var2);}
        if (var3 !== '') {variables.push(var3);}

        const dyadId = dyad;
        const dyadIndex = headers.indexOf(groupName); // find the index of the dyadType
        const dyadTypes = []; // equivalent to all the values in the column group
        data_noH.map(line => { // populate group[] and get own group
            dyadTypes.push(line[dyadIndex]);
            return data_noH;
        });
        const uniquedyadTypes = [...new Set(dyadTypes)]; // eliminate duplicates

        variables.map((variable, index) => {
            const varXIndex = headers.indexOf(variable); // find the index of the current variable
            const ownP1valuesVarX = [];
            const ownP2valuesVarX = [];
            data_noH.map(line => { 
                if (line[dyadIndex] === uniquedyadTypes[0]) {
                    if (line[idIndex] === dyadId) {
                        ownP1valuesVarX.push(line[varXIndex]);}} 
                else if (line[dyadIndex] === uniquedyadTypes[1]) {
                    if (line[idIndex] === dyadId) {
                        ownP2valuesVarX.push(line[varXIndex]);}}
                return data_noH;       
            });
            let showlegend = true;
            let yaxis = 'y';
            let xaxis = 'x';
            if (index > 0) {
                yaxis = 'y' + (index+1);
                xaxis = 'x' + (index+1);
                showlegend = false;}

            lp_data.push({x: uniqueTimes, y: ownP1valuesVarX, type: "scatter", 
                    xaxis: xaxis, yaxis: yaxis, name: uniquedyadTypes[0], connectgaps: true,
                    marker: {color: '#1f77b4'}, showlegend: showlegend});
            lp_data.push({x: uniqueTimes, y: ownP2valuesVarX, type: "scatter", 
                    xaxis: xaxis, yaxis: yaxis, name: uniquedyadTypes[1], connectgaps: true,
                    marker: {color: '#ff7f0e'}, showlegend: showlegend});
            if (variables.length === 2 && index === 0) {
                annotations.push({text: variable, showarrow: false, align: 'center',
                    xref: 'paper', yref: 'paper', x: 0, y: 0.55})}
            else if (variables.length === 3 && index === 0) {
                annotations.push({text: variable, showarrow: false, align: 'center',
                    xref: 'paper', yref: 'paper', x: 0, y: 0.36})}
            else if (variables.length === 3 && index === 1) {
                annotations.push({text: variable, showarrow: false, align: 'center',
                    xref: 'paper', yref: 'paper', x: 0, y: 0.72})}
            else {
                annotations.push({text: variable, showarrow: false, align: 'center',
                    xref: 'paper', yref: 'paper', x: 0, y: 1.1})}

            return lp_data;
        });
        let subplots;
        if (variables.length === 2) {subplots = ['xy', 'x2y2']}
        if (variables.length === 2) {subplots = ['xy', 'x2y2', 'x3y3']}
        grid = {rows: variables.length, columns: 1, subplots: subplots, 
                roworder: 'bottom to top'};
        newLayout.xaxis.zeroline = false;
        newLayout.yaxis.zeroline = false;
        newLayout.xaxis2 = {showticklabels: false};
        newLayout.xaxis3 = {showticklabels: false};
    } ////// End Time and Dyad and Multiple Variables

    /////// Default case (type 5): only time and variable
    else {
        if (groupComp) {
            const avgGroupValues = []; // each entry in the array is the mean for that time point
            uniqueTimes.map(time => {
                const valuesTimeX = []
                data_noH.map(line => {
                    if (line[timeIndex] === time) {
                        valuesTimeX.push(line[varIndex]);} 
                    return data_noH;});
                const avgTimeX = math.mean(valuesTimeX);
                return avgGroupValues.push(avgTimeX);
            });        

            lp_data.push({x: uniqueTimes, y: ownValues, type: "scatter", 
                name: "Ihre Werte", connectgaps: true});
            lp_data.push({x: uniqueTimes, y: avgGroupValues, type: "scatter", 
                name: "Werte aller Teilnehmer", connectgaps: true});
        } else {
            lp_data.push({x: uniqueTimes, y: ownValues, type: "scatter", 
                name: "Ihre Werte", connectgaps: true});
            const ownMean = math.mean(ownValues);
            const ownSd = math.std(ownValues);
            shapes.push({type: 'line', x0: uniqueTimes[0], x1: uniqueTimes[uniqueTimes.length-1], 
                y0: ownMean, y1: ownMean});
            annotations.push({text: "Ihr Mittelwert", x: uniqueTimes[0], y: ownMean, 
                xanchor: 'left', yanchor: 'bottom', showarrow: false})
            shapes.push({type: 'line', x0: uniqueTimes[0], x1: uniqueTimes[uniqueTimes.length-1], 
                y0: ownMean-ownSd, y1: ownMean-ownSd, line: {dash: 'dot'}});
            annotations.push({text: "Ihre typische Untergrenze", x: uniqueTimes[0], y: ownMean-ownSd, 
                xanchor: 'left', yanchor: 'bottom', showarrow: false})
            shapes.push({type: 'line', x0: uniqueTimes[0], x1: uniqueTimes[uniqueTimes.length-1], 
                y0: ownMean+ownSd, y1: ownMean+ownSd, line: {dash: 'dot'}});
            annotations.push({text: "Ihre typische Obergrenze", x: uniqueTimes[0], y: ownMean+ownSd, 
                xanchor: 'left', yanchor: 'bottom', showarrow: false})
        }
    } ///// End Default case
    
    if (newTitle && newTitle.length > 50){
        let i = 49;
        let char = newTitle[i];
        while (char !== ' '){
            char = newTitle[i];
            i = i-1;
        }
        newTitle = newTitle.substring(0, i+1)+'<br>'+newTitle.substring(i+2)
        newLayout.titlefont = 'top'
    }
    newLayout.title = newTitle;
    
    newLayout.annotations = annotations;
    newLayout.shapes = shapes;
    newLayout.grid = grid;

    const config = {displayModeBar: false,
        displaylogo: false,
        staticPlot: true}

    return [lp_data, newLayout, config]
}

export default prepLinePlotData;