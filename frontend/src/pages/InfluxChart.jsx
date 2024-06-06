import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import { ResponsiveLine } from "@nivo/line";
import { parseISO } from 'date-fns';

const token = "uiyAXQUUQCy7kcSzjcMg1DG1whYRLfbl-FPsFJuB2_xquITB_sRyI2V5g14b0FdnlLHYb-jhUjSHOMp8LTNpDw==";
const org = "SmartWasteManagmentSystem";
const bucket = "Sensor";
const url = "https://us-east-1-1.aws.cloud2.influxdata.com";

let query = `from(bucket: "Sensor")
    |> range(start: -20d)
    |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
    |> filter(fn: (r) => r["_field"] == "value")
    |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
    |> yield(name: "mean")`;

export const InfluxChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        let res = [];
        const influxQuery = async () => {
            // Create InfluxDB client
            const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
            // Make query
            await queryApi.queryRows(query, {
                next(row, tableMeta) {
                    const o = tableMeta.toObject(row);
                    // Push rows from query into an array object
                    res.push(o);
                },
                complete() {
                    let finalData = [];

                    for (let i = 0; i < res.length; i++) {
                        let point = {
                            x: parseISO(res[i]["_time"]),
                            y: res[i]["_value"]
                        };
                        finalData.push(point);
                    }

                    // Nivo line chart expects an array of objects with a 'data' key
                    setData([
                        {
                            id: "Sensor Data",
                            data: finalData
                        }
                    ]);
                },
                error(error) {
                    console.log("query failed- ", error);
                }
            });
        };

        influxQuery();
    }, []);

    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{
                type: 'time',
                format: 'native',
                useUTC: false,
                precision: 'minute',
                zoomable: true // Enable zoom in and zoom out
            }}
            xFormat="time:%Y-%m-%dT%H:%M:%S.%LZ"
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisLeft={{
                legend: 'Value',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            axisBottom={{
                format: '%Y-%m-%d %H:%M',
                tickValues: 'every 2 hours',
                legend: 'Time',
                legendOffset: -12,
                tickRotation: -45
            }}
            useMesh={true}
            enableSlices="x"
        />
    );
};

export default InfluxChart;
