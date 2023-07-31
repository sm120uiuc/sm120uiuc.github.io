
var yearStart = 1950;
var yearEnd = 2023;
var selectedRegion = "All";
var globalUniqueRegionsArray = [];
var globalUniqueYearsArray = [];

const margin = {top: 20, right: 120, bottom: 50, left: 75},
    svgWidth = 900,
    svgHeight = 600,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var normalize = true
var currentScene = 0

var chart, innerChart, xScale, yScale, xAxis, yAxis, valueline, g
function initializeConfiguration() {
    chart = d3.select('#chart')
    .attr("width", svgWidth)
    .attr("height", svgHeight)

    innerChart = chart.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale = d3.scaleLinear().range([0,width]);
    yScale = d3.scaleLinear().range([height, 0]);    

    xAxis = d3.axisBottom().scale(xScale);
    yAxis = d3.axisLeft().scale(yScale);

    valueline = d3.line()
    .x(function(d){ return xScale(d.date);})
    .y(function(d){ return yScale(d.value);})
    .curve(d3.curveLinear);

    g = innerChart
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`); 
}   


function onToSceneOne() {
    document.getElementById("scene0").style.display = "None"
    document.getElementById("scene1").style.display = ""
    setNormalizeFlag(1)
}

function onToSceneTwo() {
    document.getElementById("scene1").style.display = "None"
    document.getElementById("scene2").style.display = ""
    setNormalizeFlag(2)
}

function onToSceneThree() {
    document.getElementById("scene2").style.display = "None"
    document.getElementById("scene3").style.display = ""
    setNormalizeFlag(3)
}

function onToSceneZero() {
    document.getElementById("scene3").style.display = "None"
    document.getElementById("scene0").style.display = ""
    yearStart = 1950;
    yearEnd = 2023;
    selectedRegion = "All";
    globalUniqueRegionsArray = [];
    globalUniqueYearsArray = [];
    setNormalizeFlag(0)
}

function startDrawing(dataTopic) {
    if (dataTopic == 0) {
        title = "Global births and deaths (1950 - 2023)"
        d3.csv("Data/World_Birth_Death.csv").then(drawSceneOne())
        currentScene = 0
    } else if (dataTopic == 1) {
        title = "Global deaths (1955 - 1965)"
        d3.csv("Data/Region_Death.csv").then(drawSceneTwo())
        currentScene = 1
    } else if (dataTopic == 2) {
        title = "Global deaths (2015 - 2023)"
        d3.csv("Data/Region_Death.csv").then(drawSceneThree())
        currentScene = 2
    } else if (dataTopic == 3) {
        startTitleVal = "Gloabl"
        if (selectedRegion != "All") {
            startTitleVal = selectedRegion + " Region"
        }
        title = startTitleVal + " deaths (" + yearStart + " - " + yearEnd + ")"
        d3.csv("Data/Region_Death.csv").then(drawSceneFour())
        currentScene = 3
    }
    document.getElementById("plotTitle").innerHTML = title
}

function drawSceneOne(){
    return function(data) {

        years = data.map(function(d) {return parseInt(d.Year)})
        yearStart = Math.min(...years)
        yearEnd = Math.max(...years)

        var deathData, birthData, yTitle
        uniqueYears = new Set(data.map(v => v["Year"]))
        globalUniqueYearsArray = Array.from(uniqueYears);

        if (!normalize) {
            deathData = data.map(function(d) {return parseFloat(d["Deaths"])})
            birthData = data.map(function(d) {return parseFloat(d["Births"])})
            yTitle = "In thousands"
        } else {
            deathData = data.map(function(d) {return parseFloat(d["NormalizedDeaths"])})
            birthData = data.map(function(d) {return parseFloat(d["NormalizedBirths"])})
            yTitle = "% with respect to 1950"
        }
        yStart =  Math.min(Math.min(...deathData), Math.min(...birthData))
        yEnd =  Math.max(Math.max(...deathData), Math.max(...birthData))

        initializeChart(yearStart, yearEnd, "year", yStart, yEnd, yTitle)

        innerChart.append('g')
            .attr("class", "births")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(parseInt(d['Year'])); } )
            .attr("cy", function (d) { if (!normalize) {return yScale(parseFloat(d["Births"]));}else{return yScale(parseFloat(d["NormalizedBirths"]));}})
            .attr("r", 2)

            .style("fill", "#3cb44b");

        var line = d3.line()
            .x(function(d) { return xScale(parseInt(d['Year'])); }) 
            .y(function (d) { if (!normalize) {return yScale(parseFloat(d["Births"]));}else{return yScale(parseFloat(d["NormalizedBirths"]));}})
            .curve(d3.curveMonotoneX)
            
            innerChart.append("path")
            .datum(data) 
            .attr("class", "line births") 

            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "#3cb44b")
            .style("stroke-width", "2");

        innerChart.append('g')
            .attr("class", "deaths")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(parseInt(d['Year'])); } )
            .attr("cy", function (d) { if (!normalize) {return yScale(parseFloat(d["Deaths"]));}else{return yScale(parseFloat(d["NormalizedDeaths"]));}})
            .attr("r", 2)

            .style("fill", "#e6194B");
        var line = d3.line()
            .x(function(d) { return xScale(parseInt(d['Year'])); }) 
            .y(function (d) { if (!normalize) {return yScale(parseFloat(d["Deaths"]));}else{return yScale(parseFloat(d["NormalizedDeaths"]));}})
            .curve(d3.curveMonotoneX)
            
            innerChart.append("path")
            .datum(data) 
            .attr("class", "line deaths") 

            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "#e6194B")
            .style("stroke-width", "2");
        
        var labels = [{
            data: {
                Year: 1960,
                Deaths: 54963.62100000001,
                NormalizedDeaths: 1.1268092261144946,
                Calamity: "Great Chinese Famine (1959 - 1961)"
            },
            dy: -37,
            dx: 142,
            note: { align: "middle" }
        },
        {
            data: {
                Year: 2021,
                Deaths: 69236.514,
                NormalizedDeaths: 1.41941781381553,
                Calamity: "Covid-19 (2019 - Present)"
            },
            dy: 37,
            dx: -142,
            note: { align: "middle" }
        }].map(function (l) {
            label = ""
            if (normalize) {
                label = "Death rate increased by " + l.data.NormalizedDeaths.toFixed(3) + "% from 1950" 
            } else {
                label = "" + numberWithCommas(Math.round(l.data.Deaths * 1000)) + " people dead"
            }
            l.note = Object.assign({}, l.note, { title: "Calamity: " + l.data.Calamity,
            label: "" + label });
            l.subject = { radius: 25, stroke: "blue" };

            return l;
        });

        if (!normalize) {
            labels[0].dy = -25
            labels[1].dy = -25
        }

        var makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).accessors({ x: function x(d) {
            return xScale(d.Year);
          },
          y: function y(d) {
            if (!normalize) {
                return yScale(d.Deaths)
            }
            return yScale(d.NormalizedDeaths);
          }
        }).accessorsInverse({
          Year: function Year(d) {
            return xScale.invert(d.Year);
          },
          Deaths: function Deaths(d) {
            if (!normalize) {
                return yScale.invert(d.Deaths)
            }
            return yScale.invert(d.NormalizedDeaths);
          }
        }).on('subjectover', function (annotation) {
          annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", false);
        }).on('subjectout', function (annotation) {
          annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
        });

        innerChart.append("g").attr("class", "annotation-test").call(makeAnnotations);
        innerChart.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
        worldDataLengend = [
            { name: "Deaths", color: "#e6194B" },
            { name: "Births", color: "#3cb44b" },
        ];

        
		var legendItemSize = 12;
        var legendSpacing = 4;
		var xOffset = 375;
		var yOffset = 50;
        var legend = d3
			.select('#legend')
            .selectAll('.legendItem')
            .data(worldDataLengend);
			
		
		legend
			.enter()
			.append('rect')
			.attr('class', 'legendItem')
			.attr('width', legendItemSize)
			.attr('height', legendItemSize)
			.style('fill', d => d.color)
			.attr('transform',
                (d, i) => {
                    var x = xOffset;
                    var y = yOffset + (legendItemSize + legendSpacing) * i;
                    return `translate(${x}, ${y})`;
                });
		
		
		legend
			.enter()
			.append('text')
			.attr('x', xOffset + legendItemSize + 5)
			.attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
			.text(d => d.name);
    }
}

function drawSceneTwo(){
    return function(data) {
        filterData = data.filter(d => parseInt(d["Year"]) >= 1955 &&   parseInt(d["Year"]) <= 1965)

        years = filterData.map(function(d) {return parseInt(d.Year)})
        yearStartInterim = Math.min(...years)
        yearEndInterim = Math.max(...years)

        uniqueRegions = new Set(data.map(v => v["Region"]))
        uniqueRegionsArray = Array.from(uniqueRegions);
        globalUniqueRegionsArray = ["All"].concat(uniqueRegionsArray)

        var deathData, yTitle, uniqueRegionsArray
        uniqueRegions = new Set(filterData.map(v => v["Region"]))
        uniqueRegionsArray = Array.from(uniqueRegions);
        if (!normalize) {
            deathData = filterData.map(function(d) {return parseFloat(d["Deaths"])})
            yTitle = "In thousands"
        } else {
            deathData = []
            for (let i = 0; i < uniqueRegionsArray.length; i++) {
                element = uniqueRegionsArray[i]
                filteredValue = filterData.filter(v => v["Region"] == element)
                filteredValue.forEach(v=>v["NormalizedDeaths"]=v["Deaths"]/filteredValue[0]["Deaths"])
                deathData.push(...filteredValue.map(v => v["NormalizedDeaths"]))
              }
            yTitle = "% with respect to 1955"
        }
        yStart =  Math.min(...deathData)
        yEnd =  Math.max(...deathData)

        initializeChart(yearStartInterim, yearEndInterim, "year", yStart, yEnd, yTitle)

        var regionColors = {"Africa": "#469990",
                            "Americas": "#3cb44b",
                            "Asia": "#e6194B",
                            "Europe": "#808000",
                            "Oceania": "#f58231"}
        var regionColorsLegend = [
            {name: "Africa", color: "#469990"},
            {name: "Americas", color: "#3cb44b"},
            {name: "Asia", color: "#e6194B"},
            {name: "Europe", color: "#808000"},
            {name: "Oceania", color: "#f58231"}
        ];
        for (let i = 0; i < uniqueRegionsArray.length; i++) {
            element = uniqueRegionsArray[i]
            color = regionColors[element]
            filteredValue = filterData.filter(v => v["Region"] == element)
            filteredValue.forEach(v=>v["NormalizedDeaths"]=v["Deaths"]/filteredValue[0]["Deaths"])
            innerChart.append('g')
                .selectAll("dot")
                .data(filteredValue)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(parseInt(d['Year'])); } )
                .attr("cy", function (d) { if (!normalize) {return yScale(parseFloat(d["Deaths"]));}else{return yScale(parseFloat(d["NormalizedDeaths"]));}})
                .attr("r", 2)
                .style("fill", color);
            var line = d3.line()
                .x(function(d) { return xScale(parseInt(d['Year'])); }) 
                .y(function (d) { if (!normalize) {return yScale(parseFloat(d["Deaths"]));}else{return yScale(parseFloat(d["NormalizedDeaths"]));}})
                .curve(d3.curveMonotoneX)
            
            innerChart.append("path")
                .datum(filteredValue) 
                .attr("class", "line") 
                .attr("d", line)
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-width", "2");
        }
        
        var labels = [{
            data: {
                Year: 1958,
                Deaths: 29771.578999999998,
                NormalizedDeaths: 0.9916208980897604,
            },
            dy: -3,
            dx: 142,
            note: { align: "middle" }
        },
        {
            data: {
                Year: 1959,
                Deaths: 34213.368,
                NormalizedDeaths: 1.1395663865472327,
            },
            dy: -37,
            dx: -142,
            note: { align: "middle" }
        },
        {
            data: {
                Year: 1960,
                Deaths: 37750.029,
                NormalizedDeaths: 1.2573642016063207,
            },
            dy: 37,
            dx: -130,
            note: { align: "middle" }
        },
        {
            data: {
                Year: 1961,
                Deaths: 32762.186000000005,
                NormalizedDeaths: 1.0912309456177578,
            },
            dy: -67,
            dx: 142,
            note: { align: "middle" }
        },
        {
            data: {
                Year: 1962,
                Deaths: 28761.332,
                NormalizedDeaths: 0.9579719593676158,
            },
            dy: -90,
            dx: 142,
            note: { align: "middle" }
        }].map(function (l) {
            label = ""
            if (normalize) {
                label = "Death rate increased by " + l.data.NormalizedDeaths.toFixed(3) + "% from 1955" 
            } else {
                label = "" + numberWithCommas(Math.round(l.data.Deaths * 1000)) + " people dead"
            }
            titleVal = l.data.Year
            if (l.data.Year == 1958) {
                titleVal = titleVal + " (Before Famine)"
            } else if (l.data.Year == 1959){
                titleVal = titleVal + " (Start of Famine)"
            } else if (l.data.Year == 1960) {
                titleVal = titleVal + " (Peak of Famine)"
            } else if (l.data.Year == 1961) {
                titleVal = titleVal + " (End of Famine)"
            } else if (l.data.Year == 1962) {
                titleVal = titleVal + " (After Famine)"
            }
            l.note = Object.assign({}, l.note, {
                title: "Year: " + titleVal,
            label: "" + label });
            l.subject = { radius: 5 };

            return l;
        });

        if (!normalize) {
            labels[0].dy = 25
            labels[1].dy = -10
            labels[2].dy = 0
            labels[2].dx = 130
            labels[3].dy = -10
            labels[4].dy = 25
        }

        var makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).accessors({ x: function x(d) {
            return xScale(d.Year);
          },
          y: function y(d) {
            if (!normalize) {
                return yScale(d.Deaths)
            }
            return yScale(d.NormalizedDeaths);
          }
        }).accessorsInverse({
          Year: function Year(d) {
            return xScale.invert(d.Year);
          },
          Deaths: function Deaths(d) {
            if (!normalize) {
                return yScale.invert(d.Deaths)
            }
            return yScale.invert(d.NormalizedDeaths);
          }
        }).on('subjectover', function (annotation) {
          annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", false);
        }).on('subjectout', function (annotation) {
          annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
        });

        innerChart.append("g").attr("class", "annotation-test").call(makeAnnotations);
        innerChart.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);

        
		var legendItemSize = 12;
        var legendSpacing = 4;
		var xOffset = 375;
		var yOffset = 50;
        var legend = d3
			.select('#legend')
            .selectAll('.legendItem')
            .data(regionColorsLegend);
			
		
		legend
			.enter()
			.append('rect')
			.attr('class', 'legendItem')
			.attr('width', legendItemSize)
			.attr('height', legendItemSize)
			.style('fill', d => d.color)
			.attr('transform',
                (d, i) => {
                    var x = xOffset;
                    var y = yOffset + (legendItemSize + legendSpacing) * i;
                    return `translate(${x}, ${y})`;
                });
		
		
		legend
			.enter()
			.append('text')
			.attr('x', xOffset + legendItemSize + 5)
			.attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
			.text(d => d.name);
    }
}

function drawSceneThree(){
    return function(data) {
        filterData = data.filter(d => parseInt(d["Year"]) >= 2015 &&   parseInt(d["Year"]) <= 2023)

        years = filterData.map(function(d) {return parseInt(d.Year)})
        yearStartInterim = Math.min(...years)
        yearEndInterim = Math.max(...years)

        var deathData, yTitle, uniqueRegionsArray
        uniqueRegions = new Set(filterData.map(v => v["Region"]))
        uniqueRegionsArray = Array.from(uniqueRegions);
        if (!normalize) {
            deathData = filterData.map(function(d) {return parseFloat(d["Deaths"])})
            yTitle = "In thousands"
        } else {
            deathData = []
            for (let i = 0; i < uniqueRegionsArray.length; i++) {
                element = uniqueRegionsArray[i]
                filteredValue = filterData.filter(v => v["Region"] == element)
                filteredValue.forEach(v=>v["NormalizedDeaths"]=v["Deaths"]/filteredValue[0]["Deaths"])
                deathData.push(...filteredValue.map(v => v["NormalizedDeaths"]))
              }
            yTitle = "% with respect to 2015"
        }
        yStart =  Math.min(...deathData)
        yEnd =  Math.max(...deathData)

        initializeChart(yearStartInterim, yearEndInterim, "year", yStart, yEnd, yTitle)

        var regionColors = {"Africa": "#469990",
                            "Americas": "#3cb44b",
                            "Asia": "#e6194B",
                            "Europe": "#808000",
                            "Oceania": "#f58231"}
        var regionColorsLegend = [
            {name: "Africa", color: "#469990"},
            {name: "Americas", color: "#3cb44b"},
            {name: "Asia", color: "#e6194B"},
            {name: "Europe", color: "#808000"},
            {name: "Oceania", color: "#f58231"}
        ];
        for (let i = 0; i < uniqueRegionsArray.length; i++) {
            element = uniqueRegionsArray[i]
            color = regionColors[element]
            filteredValue = filterData.filter(v => v["Region"] == element)
            filteredValue.forEach(v=>v["NormalizedDeaths"]=v["Deaths"]/filteredValue[0]["Deaths"])
            innerChart.append('g')
                .attr("class", element)
                .selectAll("dot")
                .data(filteredValue)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(parseInt(d['Year'])); } )
                .attr("cy", function (d) { if (!normalize) {return yScale(parseFloat(d["Deaths"]));}else{return yScale(parseFloat(d["NormalizedDeaths"]));}})
                .attr("r", 2)
                .style("fill", color);
            var line = d3.line()
                .x(function(d) { return xScale(parseInt(d['Year'])); }) 
                .y(function (d) { if (!normalize) {return yScale(parseFloat(d["Deaths"]));}else{return yScale(parseFloat(d["NormalizedDeaths"]));}})
                .curve(d3.curveMonotoneX)
            
            innerChart.append("path")
                .datum(filteredValue) 
                .attr("class", "line " + element) 
                .attr("d", line)
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-width", "2");
        }
        
        var labels = [{
            data: {
                Region: "Africa",
                Year: 2021,
                Deaths: 12038.079,
                DeathsMale: 6400.686999999999,
                DeathsFemale: 5637.397000000001,
                NormalizedDeaths: 1.1307015967697347
            },
            dy: -10,
            dx: -300,
            note: { align: "middle" }
        },
        {
            data: {
                Region: "Americas",
                Year: 2021,
                Deaths: 9114.036,
                DeathsMale: 5049.244000000001,
                DeathsFemale: 4064.7929999999997,
                NormalizedDeaths: 1.3264433455639058
            },
            dy: 37,
            dx: -300,
            note: { align: "middle" }
        },
        {
            data: {
                Region: "Asia",
                Year: 2021,
                Deaths: 38150.365,
                DeathsMale: 21029.066,
                DeathsFemale: 17121.300000000003,
                NormalizedDeaths: 1.2745016420535416
            },
            dy: 37,
            dx: -300,
            note: { align: "middle" }
        },
        {
            data:  {
                Region: "Europe",
                Year: 2021,
                Deaths: 9644.438,
                DeathsMale: 4885.170000000001,
                DeathsFemale: 4759.271000000001,
                NormalizedDeaths: 1.1805923062760983
            },
            dy: -67,
            dx: -300,
            note: { align: "middle" }
        },
        {
            data: {
                Region: "Oceania",
                Year: 2021,
                Deaths: 289.596,
                DeathsMale: 154.224,
                DeathsFemale: 135.368,
                NormalizedDeaths: 1.0947774312446834
            },
            dy: -90,
            dx: -300,
            id: "Oceania",
            note: { align: "middle" }
        }].map(function (l) {
            label = ""
            if (normalize) {
                label = "In 2021 death rate increased by " + l.data.NormalizedDeaths.toFixed(3) + "% from 2015" 
            } else {
                label = "" + numberWithCommas(Math.round(l.data.Deaths * 1000)) + " people dead in the year 2021"
            }
            l.note = Object.assign({}, l.note, { title: "Region: " + l.data.Region,
            label: "" + label });
            l.subject = { radius: 5 };

            return l;
        });

        if (!normalize) {
            labels[4].dy = -30
        }

        var makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).accessors({ x: function x(d) {
            return xScale(d.Year);
          },
          y: function y(d) {
            if (!normalize) {
                return yScale(d.Deaths)
            }
            return yScale(d.NormalizedDeaths);
          }
        }).accessorsInverse({
          Year: function Year(d) {
            return xScale.invert(d.Year);
          },
          Deaths: function Deaths(d) {
            if (!normalize) {
                return yScale.invert(d.Deaths)
            }
            return yScale.invert(d.NormalizedDeaths);
          }
        }).on('subjectover', function (annotation) {
          annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", false);
        }).on('subjectout', function (annotation) {
          annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
        });

        innerChart.append("g").attr("class", "annotation-test").attr("id", "sceneThree").call(makeAnnotations);
        innerChart.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);

        gThree = document.getElementById("sceneThree")
        gs = gThree.getElementsByClassName("annotation callout circle")
        for (let i=0; i<gs.length; i++) {
            classes = gs[i].getAttribute("class")
            gs[i].setAttribute("class",classes + regionColorsLegend[i].name)
        }
        

        
		var legendItemSize = 12;
        var legendSpacing = 4;
		var xOffset = 375;
		var yOffset = 50;
        var legend = d3
			.select('#legend')
            .selectAll('.legendItem')
            .data(regionColorsLegend);
			
		
		legend
			.enter()
			.append('rect')
			.attr('class', 'legendItem')
			.attr('width', legendItemSize)
			.attr('height', legendItemSize)
			.style('fill', d => d.color)
			.attr('transform',
                (d, i) => {
                    var x = xOffset;
                    var y = yOffset + (legendItemSize + legendSpacing) * i;
                    return `translate(${x}, ${y})`;
                });
		
		
		legend
			.enter()
			.append('text')
			.attr('x', xOffset + legendItemSize + 5)
			.attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
			.text(d => d.name);
    }
}

function drawSceneFour(){
    return function(data) {
        filterDataYear = data.filter(d => parseInt(d["Year"]) >= yearStart &&   parseInt(d["Year"]) <= yearEnd)
        if (selectedRegion != "All") {
            filterData = filterDataYear.filter(d => d["Region"] == selectedRegion)
        } else {
            filterData = filterDataYear
        }

        years = filterData.map(function(d) {return parseInt(d.Year)})
        yearStartInterim = Math.min(...years)
        yearEndInterim = Math.max(...years)

        var deathData, yTitle, uniqueRegionsArray
        addStartYearList()
        addEndYearList()

        uniqueRegions = new Set(filterData.map(v => v["Region"]))
        uniqueRegionsArray = Array.from(uniqueRegions);
        addRegionList()
        if (!normalize) {
            deathData = filterData.map(function(d) {return parseFloat(d["Deaths"])})
            yTitle = "In thousands"
        } else {
            deathData = []
            for (let i = 0; i < uniqueRegionsArray.length; i++) {
                element = uniqueRegionsArray[i]
                filteredValue = filterData.filter(v => v["Region"] == element)
                filteredValue.forEach(v=>v["NormalizedDeaths"]=v["Deaths"]/filteredValue[0]["Deaths"])
                deathData.push(...filteredValue.map(v => v["NormalizedDeaths"]))
              }
            yTitle = "% with respect to " + yearStart;
        }
        yStart =  Math.min(...deathData)
        yEnd =  Math.max(...deathData)

        initializeChart(yearStartInterim, yearEndInterim, "year", yStart, yEnd, yTitle)

        var regionColors = {"Africa": "#469990",
                            "Americas": "#3cb44b",
                            "Asia": "#e6194B",
                            "Europe": "#808000",
                            "Oceania": "#f58231"}

        for (let i = 0; i < uniqueRegionsArray.length; i++) {
            element = uniqueRegionsArray[i]
            color = regionColors[element]
            filteredValue = filterData.filter(v => v["Region"] == element)
            filteredValue.forEach(v=>v["NormalizedDeaths"]=v["Deaths"]/filteredValue[0]["Deaths"])
            innerChart.append('g')
                .attr("class", element)
                .selectAll("dot")
                .data(filteredValue)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return xScale(parseInt(d['Year'])); } )
                .attr("cy", function (d) { if (!normalize) {return yScale(parseFloat(d["Deaths"]));}else{return yScale(parseFloat(d["NormalizedDeaths"]));}})
                .attr("r", 2)
                .style("fill", color);
            var line = d3.line()
                .x(function(d) { return xScale(parseInt(d['Year'])); }) 
                .y(function (d) { if (!normalize) {return yScale(parseFloat(d["Deaths"]));}else{return yScale(parseFloat(d["NormalizedDeaths"]));}})
                .curve(d3.curveMonotoneX)
            
            innerChart.append("path")
                .datum(filteredValue) 
                .attr("class", "line " + element) 
                .attr("d", line)
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-width", "2");
        }        
        handleRegionChange()

        var regionColorsLegend = [
            { name: "Africa", color: "#469990" },
            { name: "Americas", color: "#3cb44b" },
            { name: "Asia", color: "#e6194B" },
            { name: "Europe", color: "#808000" },
            { name: "Oceania", color: "#f58231" }
        ];

        if (selectedRegion != "All") {
            regionColorsLegend = [{ name: selectedRegion, color: regionColors[selectedRegion]}]
        }
		var legendItemSize = 12;
        var legendSpacing = 4;
		var xOffset = 375;
		var yOffset = 50;
        var legend = d3
			.select('#legend')
            .selectAll('.legendItem')
            .data(regionColorsLegend);
			
		
		legend
			.enter()
			.append('rect')
			.attr('class', 'legendItem')
			.attr('width', legendItemSize)
			.attr('height', legendItemSize)
			.style('fill', d => d.color)
			.attr('transform',
                (d, i) => {
                    var x = xOffset;
                    var y = yOffset + (legendItemSize + legendSpacing) * i;
                    return `translate(${x}, ${y})`;
                });
		
		
		legend
			.enter()
			.append('text')
			.attr('x', xOffset + legendItemSize + 5)
			.attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
			.text(d => d.name);
    }
}

function initializeChart(xScaleStart, xScaleEnd, xScaleText, yScaleStart, yScaleEnd, yScaleText) {
    xScale.domain([xScaleStart, xScaleEnd]);
    yScale.domain([yScaleStart, yScaleEnd]);



    innerChart
        .append('g')
        .attr('transform', "translate(0," + height + ")")
        .call(xAxis);

    innerChart
        .append("text")             
        .attr("transform",
            "translate(" + (width/2) + " ," + 
                            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(xScaleText);



    innerChart
        .append('g')
        .call(yAxis)

    innerChart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yScaleText);
}

function setNormalizeFlag(scene){
    normalize = true
    resetCheckBoxChecked()
    resetSvg()
    initializeConfiguration()
    if (scene == -1) {
        scene = currentScene
    }
    startDrawing(scene)
}

function unsetNormalizeFlag(scene){
    normalize = false
    resetCheckBoxUnchecked()
    resetSvg()
    initializeConfiguration()
    if (scene == -1) {
        scene = currentScene
    }
    startDrawing(scene)
}

function resetSvg() {
    element = document.getElementById("chart");
    while (element.lastElementChild) {
        element.removeChild(element.lastElementChild);
    }
    element = document.getElementById("legend");
    while (element.lastElementChild) {
        element.removeChild(element.lastElementChild);
    }
    element = document.getElementById("regions");
    if (element != null) {
        element.remove()
    }
    element = document.getElementById("startYear");
    if (element != null) {
        element.remove()
    }
    element = document.getElementById("endYear");
    if (element != null) {
        element.remove()
    }
}

function resetCheckBoxUnchecked() {
    var checkBox = document.getElementById("myCheck");
    checkBox.checked = false
}

function resetCheckBoxChecked() {
    var checkBox = document.getElementById("myCheck");
    checkBox.checked = true
}

function hideElementsByClass(className) {
    elements = document.getElementsByClassName(className)
    for (let i=0; i<elements.length; i++) {
        elements[i].setAttribute("visibility","hidden")
    }
}

function unHideElementsByClass(className) {
    elements = document.getElementsByClassName(className)
    for (let i=0; i<elements.length; i++) {
        elements[i].removeAttribute("visibility")
    }
}

function addRegionList(){


    d3.select("body")
        .select("#region_selector")
        .append("select")
        .attr("id", "regions")
        .selectAll("options")
        .data(globalUniqueRegionsArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d; })
        .text(function (d, i){return d;});
    
    document.getElementById("regions").value = selectedRegion;
    d3.select("body").select("#region_selector").select("select").on("change", function(){
        region = d3.select(this).property('value');
        selectedRegion = region;
        handleChange();
    });
}

function handleRegionChange() {
    for (let i=1; i<globalUniqueRegionsArray.length; i++) {
        currRegion = globalUniqueRegionsArray[i]
        if (selectedRegion == "All" || selectedRegion == currRegion) {
            unHideElementsByClass(currRegion)
        } else if (selectedRegion != currRegion) {
            hideElementsByClass(currRegion)   
        }
    }
}

function addStartYearList(){
    d3.select("body")
        .select("#start_year_selector")
        .append("select")
        .attr("id", "startYear")
        .selectAll("options")
        .data(globalUniqueYearsArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d; })
        .text(function (d, i){return d;});
    
    document.getElementById("startYear").value = yearStart
    d3.select("body").select("#start_year_selector").select("select").on("change", function(){
        yearStart = d3.select(this).property('value');
        handleChange()
    });
}

function addEndYearList(){
    data = []
    for(let i = globalUniqueYearsArray.length - 1; i >= 0; i--) {        
        data.push(globalUniqueYearsArray[i])
    }
    d3.select("body")
        .select("#end_year_selector")
        .append("select")
        .attr("id", "endYear")
        .selectAll("options")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function(d){ return d; })
        .text(function (d, i){return d;});

    document.getElementById("endYear").value = yearEnd
    d3.select("body").select("#end_year_selector").select("select").on("change", function(){
        yearEnd = d3.select(this).property('value');
        handleChange()
    });
}

function handleChange() {
    var checkBox = document.getElementById("myCheck");
    if (checkBox.checked) {
        setNormalizeFlag(-1)
    } else {
        unsetNormalizeFlag(-1)
    }
    handleRegionChange()
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}