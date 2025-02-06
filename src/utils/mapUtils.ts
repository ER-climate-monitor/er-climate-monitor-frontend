import { Chart } from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';

/**
 * Creates and configures a line chart for sensor data visualization
 * @param canvas - HTML canvas element to render the chart
 * @param labels - Array of timestamp labels for X-axis
 * @param values - Array of sensor values for Y-axis
 * @returns Configured Chart instance
 */
export function createSensorChart(canvas: HTMLCanvasElement, labels: string[], values: number[]): Chart {
    const config: ChartConfiguration<'line'> = {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Detection Values',
                    data: values,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Timestamp',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value',
                    },
                },
            },
        },
    };

    return new Chart(canvas, config);
}

export function formatShortDate(dateString: string): string {
    let date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.error('Invalid date format:', dateString);
        date = new Date()
    }

    return date.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
}
