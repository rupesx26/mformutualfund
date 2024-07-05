// NavChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const NavChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        if (data && data.length > 0) {
            const labels = data.map(entry => entry.date);
            const values = data.map(entry => parseFloat(entry.nav));

            const ctx = document.getElementById('navChart');
            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels.reverse(),
                    datasets: [{
                        label: 'NAV',
                        data: values.reverse(),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data]);

    return (
        <div>
            <canvas id="navChart" width="400" height="200"></canvas>
        </div>
    );
};

export default NavChart;
