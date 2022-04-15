/* global Chart */

const canvas = document.getElementById('myChart')
let myChart

// documentatie 
// https://www.chartjs.org/docs/latest/charts/scatter.html

export function createChart(columns){
    const config = {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Training data',
                data: columns,
                backgroundColor: 'rgb(185, 185, 255)'
            }]
        },
        options: {
            scales: {
                x: {
                    title: {display: true, text: 'Price'}
                },
                y: {
                    title: {display: true, text: 'Mileage'}
                }
            },
            layout: {
                autoPadding: true,
                //padding: 15,
                maintainAspectRatio: false
            }
        }
    }

    myChart = new Chart(canvas, config)
}

// update an existing chart
// https://www.chartjs.org/docs/latest/developers/updates.html
export function updateChart(label, data){
    myChart.data.datasets.push({
        label,
        data,
        backgroundColor: 'rgb(255, 44, 44)'
    })
    myChart.update()
}

export function updateUserChart(label, data){
    myChart.data.datasets.push({
        label,
        data,
        backgroundColor: 'rgb(34,139,34)'
    })
    myChart.update()
}
