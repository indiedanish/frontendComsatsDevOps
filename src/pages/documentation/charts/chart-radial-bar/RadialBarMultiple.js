import React, { useState } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Chart from '../../../../components/extras/Chart';

const RadialBarMultiple = (props) => {

	alert(props.data)

	




	const [state] = useState({
		series: [44, 55, 67],
		options: {
			chart: {
				height: 350,
				type: 'radialBar',
			},
			plotOptions: {
				radialBar: {
					dataLabels: {
						name: {
							fontSize: '22px',
						},
						value: {
							fontSize: '16px',
						},
						total: {
							show: true,
							label: 'Total',
							formatter(w) {
								// By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
								return w.globals.series.reduce((a, b) => a + b, 0);
							},
						},
					},
				},
			},
			labels: [ 'Design', 'Development','Testing'],
			stroke: {
				lineCap: 'round',
			},
		},
	});
	return (
		<div className=''>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='DonutLarge'>
						<CardTitle>
							Requirement Stats <small>Total</small>
						</CardTitle>
						<CardSubTitle>Widget</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<Chart
						series={props.data}
						options={state.options}
						type={state.options.chart.type}
						height={state.options.chart.height}
					/>
				</CardBody>
			</Card>
		</div>
	);
};

export default RadialBarMultiple;
