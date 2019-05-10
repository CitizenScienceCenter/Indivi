import * as math from 'mathjs';

const prepBoxPlotData = (data_noH, headers, partId, topicConfig, dyad, groupComp) => {
    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length; // generic function to compute average

    const variableName = topicConfig.variable;
    const groupName = topicConfig.group;
    const var2 = topicConfig.variable2;
    const var3 = topicConfig.variable3;

    const varIndex = headers.indexOf(variableName); // find the index of the variable
    const idIndex = headers.indexOf(topicConfig.id);// find the index of the partId
    
    ///// variables needed for the state
    const bp_data = [];


    let ownValue;
    let ownGroupIndex;
    const newLayout = {
        width: 500, l:0, 
        height: 400,
        showlegend: true,
        legend: {"orientation": "h",
                xanchor: "center",
                yanchor: 'bottom',
                y: 0,
                x: 0.5},
        annotations: [],
        grid: {},
        shapes: []};
    const annotations = [];
    let newTitle;

    /////// handling only groups (without dyads)
    if (groupName !== '' && !dyad && var2 === '' && var3 === '') {
        const groupIndex = headers.indexOf(groupName); // find the index of the group
        const group = []; // equivalent to all the values in the column group
        let ownGroup;
        data_noH.map(line => { // populate group[] and get own group
            if (line[idIndex] === partId) {
                return ownGroup = (line[groupIndex]);}
            return group.push(line[groupIndex]);
        });
        const uniqueGroups = [...new Set(group)]; // eliminate duplicates (have each partId only once)
        const ownValues = [];

        const valuesPerGroup = []; // array of arrays where each subarray contain all the values of the variable for that group
        
        uniqueGroups.map(group => {
            const variable = []; // is used only within the loop
            data_noH.map(line => {
                if (line[groupIndex] === group) {
                    variable.push(line[varIndex]);} // gets all values for the group
                if (line[idIndex] === partId) {
                    ownValues.push(line[varIndex]);}
                return data_noH;
            })
            valuesPerGroup.push(variable);
            if (groupComp) {
                bp_data.push({y: variable, type: "box", name: group, boxpoints: false})
            } else { if (group === ownGroup)
                bp_data.push({y: variable, type: "box", name: group, boxpoints: false})
            } return valuesPerGroup;
        });
        ownValue = arrAvg(ownValues.map(Number));
        ownGroupIndex = uniqueGroups.indexOf(ownGroup); // find index of own group
        newLayout.legend = {};
        newLayout.showlegend = false;
        if (groupComp) {
            annotations.push({
                text: "Ihr<br>Wert",
                x: ownGroupIndex,
                y: ownValue,
                arrowhead: 7,
                axref: 'x',
                ayref: 'y',
                ax: ownGroupIndex-0.4, 
                ay: ownValue})}
        else { annotations.push({
            text: "Ihr<br>Wert",
            x: 0,
            y: ownValue,
            arrowhead: 7,
            axref: 'x',
            ayref: 'y',
            ax: -0.35, 
            ay: ownValue})}
    }
    ///////// End Groups without dyads

    ///////// handling dyads
    // since dyads only have two groups, the index is either 0 or 1
    else if (groupName !== '' && dyad && var2 === '' && var3 === '') {
        const dyadId = dyad;
        const dyadIndex = headers.indexOf(groupName); // find the index of the dyadType
        const dyadTypes = []; // equivalent to all the values in the column group
        data_noH.map(line => { // populate group[] and get own group
            dyadTypes.push(line[dyadIndex]);
            return data_noH;
        });
        const uniquedyadTypes = [...new Set(dyadTypes)]; // eliminate duplicates
        const allP1values = [];
        const allP2values = [];
        const ownP1values = [];
        const ownP2values = [];
        data_noH.map(line => { 
            if (line[dyadIndex] === uniquedyadTypes[0]) {
                allP1values.push(line[varIndex]);
                if (line[idIndex] === dyadId) {
                    ownP1values.push(line[varIndex]);}} 
            else if (line[dyadIndex] === uniquedyadTypes[1]) {
                 allP2values.push(line[varIndex]);
                if (line[idIndex] === dyadId) {
                    ownP2values.push(line[varIndex]);}}
            return data_noH;       
        });

        bp_data.push({y: allP1values, type: "box", name: uniquedyadTypes[0], boxpoints: false})
        bp_data.push({y: allP2values, type: "box", name: uniquedyadTypes[1], boxpoints: false})

        const ownP1value = arrAvg(ownP1values.map(Number));
        const ownP2value = arrAvg(ownP2values.map(Number));
        annotations.push(
            {text: "Ihr<br>Wert",
            x: 0,
            y: ownP1value, 
            arrowhead: 7,
            axref: 'x',
            ayref: 'y',
            ax: -0.5, 
            ay: ownP1value},
            {text: "Ihr<br>Wert",
            x: 1,
            y: ownP2value,
            arrowhead: 7,
            axref: 'x',
            ayref: 'y',
            ax: 0.5, 
            ay: ownP2value})

        newLayout.showlegend = false;
    }
    /////////  End Dyad

    ///////// Multiple variables without group/dyad
    else if ((var2 !== '' || var3 !== '') && groupName === '') {
        const variables = [];
        variables.push(variableName);
        if (var2 !== '') {variables.push(var2);}
        if (var3 !== '') {variables.push(var3);}

        variables.map((variable, index) => {
            const valuesVarX = []; // is used only within the loop
            const varXIndex = headers.indexOf(variable); // find the index of var
            const ownValuesVarX = [];
            data_noH.map(line => {
                valuesVarX.push(line[varXIndex])
                if (line[idIndex] === partId) {
                    ownValuesVarX.push(line[varXIndex]);}
                return data_noH;
            })
            // standardize the array of ALL values with the Z transformation
            const mean_valuesVarX = math.mean(valuesVarX);
            const sd_valuesVarX = math.std(valuesVarX);
            const zTrans_valuesVarX = [];
            valuesVarX.map(val => {
                zTrans_valuesVarX.push((val-mean_valuesVarX)/sd_valuesVarX);
                return zTrans_valuesVarX;
            })
            // standardize the array of OWN values with the Z transformation
            const zTrans_ownValuesVarX = [];
            ownValuesVarX.map(val => {
                zTrans_ownValuesVarX.push((val-mean_valuesVarX)/sd_valuesVarX);
                return zTrans_ownValuesVarX;
            })
            const ownVarX = arrAvg(zTrans_ownValuesVarX.map(Number));
            bp_data.push({y: zTrans_valuesVarX, type: "box", name: variable, boxpoints: false});
            annotations.push({
                text: "Ihr<br>Wert",
                x: index,
                y: ownVarX,
                arrowhead: 7,
                axref: 'x',
                ayref: 'y',
                ax: index-0.45, 
                ay: ownVarX})
            return variables
        });
        newLayout.yaxis = {zeroline: false, showticklabels: false}
        newLayout.showlegend = false;
    }
    ///////// End Multiple variables without dyad/goup

    ///////// Multiple varialbes with group
    else if ((var2 !== '' || var3 !== '') && groupName !== '' && !dyad) {
        const variables = []; // list of the multiple variables
        variables.push(variableName);
        if (var2 !== '') {variables.push(var2);}
        if (var3 !== '') {variables.push(var3);}

        const groupIndex = headers.indexOf(groupName); // find the index of the group
        let ownGroup;
        data_noH.map(line => { // populate group[] and get own group
            if (line[idIndex] === partId) {
                ownGroup = (line[groupIndex]);}
            return ownGroup;
        });

        variables.map((variable, index) => {
            const valuesVarX = []; // only values of own group - is used only within the loop
            const varXIndex = headers.indexOf(variable); // find the index of var
            const ownValuesVarX = [];
            data_noH.map(line => {
                if (line[groupIndex] === ownGroup){
                    valuesVarX.push(line[varXIndex])
                }
                if (line[idIndex] === partId) {
                    ownValuesVarX.push(line[varXIndex]);}
                return data_noH;
            })
            // standardize the array of ALL values with the Z transformation
            const mean_valuesVarX = math.mean(valuesVarX);
            const sd_valuesVarX = math.std(valuesVarX);
            const zTrans_valuesVarX = [];
            valuesVarX.map(val => {
                zTrans_valuesVarX.push((val-mean_valuesVarX)/sd_valuesVarX);
                return zTrans_valuesVarX;
            })
            // standardize the array of OWN values with the Z transformation
            const zTrans_ownValuesVarX = [];
            ownValuesVarX.map(val => {
                zTrans_ownValuesVarX.push((val-mean_valuesVarX)/sd_valuesVarX);
                return zTrans_ownValuesVarX;
            })
            const ownVarX = arrAvg(zTrans_ownValuesVarX.map(Number));
            bp_data.push({y: zTrans_valuesVarX, type: "box", name: variable, boxpoints: false});
            // newLayout.
            annotations.push({
                text: "Ihr<br>Wert",
                x: index,
                y: ownVarX,
                arrowhead: 7,
                axref: 'x',
                ayref: 'y',
                ax: index-0.5, 
                ay: ownVarX})
            newLayout.yaxis = {zeroline: false, showticklabels: false};
            newLayout.showlegend = false;
            //newLayout.xaxis = {zeroline: false, showticklabels: false};
            return variables
        });
        newTitle = 'Für die Gruppe ' + ownGroup;
    }
    ///////// End Multiple variables with group

    ///////// Multiple varialbes with dyad
    else if ((var2 !== '' || var3 !== '') && groupName !== '' && dyad) {
        // get the variables
        const variables = [];
        variables.push(variableName);
        if (var2 !== '') {variables.push(var2);}
        if (var3 !== '') {variables.push(var3);}

        // get the dyads
        const dyadId = dyad;
        const dyadIndex = headers.indexOf(groupName); // find the index of the dyadType
        const dyadTypes = []; // equivalent to all the values in the column group
        data_noH.map(line => { // populate group[] and get own group
            dyadTypes.push(line[dyadIndex]);
            return data_noH;
        });
        const uniquedyadTypes = [...new Set(dyadTypes)]; // eliminate duplicates
        let newShape = [];

        variables.map((variable, index) => {
            // for each variable, get all values of P1 and P2 as well as own P1 and P2 values
            const allP1values = [];
            const allP2values = [];
            const allValues = [];
            const ownP1values = [];
            const ownP2values = [];

            const varXIndex = headers.indexOf(variable); // find the index of var
            data_noH.map(line => {
                allValues.push(line[varXIndex]);
                if (line[dyadIndex] === uniquedyadTypes[0]) {
                    allP1values.push(line[varXIndex]);
                    if (line[idIndex] === dyadId) {
                        ownP1values.push(line[varXIndex]);}} 
                else if (line[dyadIndex] === uniquedyadTypes[1]) {
                     allP2values.push(line[varXIndex]);
                    if (line[idIndex] === dyadId) {
                        ownP2values.push(line[varXIndex]);}}
                return allValues;
            })
            // standardize the array of P1 and P2 ALL values with the Z transformation
            const mean_allP1values = math.mean(allP1values);
            const sd_allP1values = math.std(allP1values);
            const zTrans_allP1values = [];
            allP1values.map(val => {
                zTrans_allP1values.push((val-mean_allP1values)/sd_allP1values);
                return zTrans_allP1values;
            })
            const mean_allP2values = math.mean(allP2values);
            const sd_allP2values = math.std(allP2values);
            const zTrans_allP2values = [];
            allP2values.map(val => {
                zTrans_allP2values.push((val-mean_allP2values)/sd_allP2values);
                return zTrans_allP2values;
            })
            // standardize the array of P1 and P2 OWN values with the Z transformation
            const zTrans_ownP1values = [];
            ownP1values.map(val => {
                zTrans_ownP1values.push((val-mean_allP1values)/sd_allP1values);
                return zTrans_ownP1values;
            })
            const zTrans_ownP2values = [];
            ownP1values.map(val => {
                zTrans_ownP2values.push((val-mean_allP2values)/sd_allP2values);
                return zTrans_ownP2values;
            })
            // standardise array "allValues"
            const mean_allValues = math.mean(allValues);
            const sd_allValues = math.std(allValues);
            const zTrans_allValues = [];
            allValues.map(val => {
                zTrans_allValues.push((val-mean_allValues)/sd_allValues);
                return zTrans_allValues;
            })

            bp_data.push({y: zTrans_allValues, x: dyadTypes, type: "box", name: variable, boxpoints: false})

            const ownP1value = arrAvg(zTrans_ownP1values.map(Number));
            const ownP2value = arrAvg(zTrans_ownP2values.map(Number));            
            let pos_xaxis_P1 = 0;
            let pos_xaxis_P2 = 1;
            if (variables.length === 2) {
                pos_xaxis_P1 = 0-0.18+(index*0.36);
                pos_xaxis_P2 = 1-0.18+(index*0.36);
            } else if (variables.length === 3) {
                pos_xaxis_P1 = 0+(index-1)*0.235;
                pos_xaxis_P2 = 1+(index-1)*0.235;
            }

            if (index === 0) {
                annotations.push(
                    {text: "Ihr<br>Wert",
                    x: pos_xaxis_P1,
                    y: ownP1value,
                    arrowhead: 7,
                    axref: 'x',
                    ayref: 'y',
                    ax: pos_xaxis_P1-0.25, 
                    ay: ownP1value},
                    {text: "Ihr<br>Wert",
                    x: pos_xaxis_P2,
                    y: ownP2value,
                    arrowhead: 7,
                    axref: 'x',
                    ayref: 'y',
                    ax: pos_xaxis_P2-0.25, 
                    ay: ownP2value })
            } else {
                newShape.push(
                    { type: 'rect',
                    xref: 'x',
                    yref: 'y',
                    fillcolor: 'rgba(0, 0, 0, 1)',
                    x0: pos_xaxis_P1-0.02,
                    x1: pos_xaxis_P1+0.02,
                    y0: ownP1value-0.05,
                    y1: ownP1value+0.05
                    });
                newShape.push(
                    { type: 'rect',
                    xref: 'x',
                    yref: 'y',
                    fillcolor: 'rgba(0, 0, 0, 1)',
                    x0: pos_xaxis_P2-0.02,
                    x1: pos_xaxis_P2+0.02,
                    y0: ownP2value-0.05,
                    y1: ownP2value+0.05
                    });
            }
            
            return variables
        });
        newLayout.shapes = newShape;
        newLayout.showlegend = true;
        newLayout.legend = 
            {"orientation": "h",
            xanchor: "center",
            yanchor: 'top',
            y: 1.1,
            x: 0.5}
        newLayout.yaxis = {zeroline: false, showticklabels: false};
        newLayout.boxmode = 'group'
    }
    ///////// End Multiple variables with dyad

    //// Default case: select all the values for 1 participant and 1 varialble
    else {
        const variable = []; // equivalent to all the values in the column of the chosen variable
        const ownValues = [];
        data_noH.map(line => {
            if (line[idIndex] === partId) {
                ownValues.push(line[varIndex]);}
            variable.push(line[varIndex]);
            return variable;
        });
        ownValue = arrAvg(ownValues.map(Number));
        ownGroupIndex = 0;
        bp_data.push({y: variable, type: "box", name: "", boxpoints: false});
        annotations.push({
            text: "Ihr<br>Wert",
            x: 0,
            y: ownValue,
            arrowhead: 7,
            axref: 'x',
            ayref: 'y',
            ax: ownGroupIndex-0.4, 
            ay: ownValue})
        newLayout.legend = {};
        newLayout.showlegend = false;
        newLayout.xaxis = {zeroline: false, showticklabels: false};
    }
    /////

    newLayout.annotations = annotations;
    
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

    const config = {displayModeBar: false,
        displaylogo: false,
        staticPlot: true}

    return [bp_data, newLayout, config]
}

export default prepBoxPlotData;