import React from 'react';

import Chart from '../../../components/extras/Chart';
import * as ChartLineStories from './ChartLine.stories';

export default {
	title: 'Extra/<Chart>/Column',
	component: Chart,
	argTypes: { ...ChartLineStories.default.argTypes },
};

const Template = (args) => {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <Chart {...args} />;
};

export const ColumnBasic = Template.bind({});
ColumnBasic.args = {
	series: [
		{
			name: 'Net Profit',
			data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
		},
		{
			name: 'Revenue',
			data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
		},
		{
			name: 'Free Cash Flow',
			data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
		},
	],
	options: {
		chart: {
			type: 'bar',
			height: 350,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
				endingShape: 'rounded',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		xaxis: {
			categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
		},
		yaxis: {
			title: {
				text: '$ (thousands)',
			},
		},
		fill: {
			opacity: 1,
		},
		tooltip: {
			y: {
				formatter(val) {
					return `$ ${val} thousands`;
				},
			},
		},
	},
	type: 'bar',
	height: 350,
};
