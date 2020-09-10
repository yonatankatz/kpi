let chartUI = (id, dataSet) => {
  let config = {
    type: 'doughnut',
    data: {
        datasets: [{
            data: dataSet,
            backgroundColor: [
              'rgb(151, 196, 130)',
              'rgb(218, 218, 218)'],
        }]
    },
    options: {
        cutoutPercentage: 75,
        responsive: true,
        // maintainAspectRatio: false,
        legend: {
            display: false,
            position: 'top',
        },
        title: {
          display: false,
          // text: title,
          // position: 'bottom',
          // padding: 50,
          // lineHeight: 2
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
    }
};

let ctx = document.getElementById(id).getContext('2d');
let myDoughnut = new Chart(ctx, config);
}
