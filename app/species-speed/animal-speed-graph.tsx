/* eslint-disable */
"use client";
import { useRef, useEffect, useState  } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { csv } from "d3-fetch";

// define interface
interface AnimalDatum {
  name: string;
  speed: number;        
  diet: "herbivore" | "omnivore" | "carnivore";
}

export default function AnimalSpeedGraph() {
  const graphRef = useRef<HTMLDivElement>(null);

  const [animalData, setAnimalData] = useState<AnimalDatum[]>([]);

  // load csv
  useEffect(() => {
    csv("/sample_animals.csv").then((rawData) => {
      const parsed: AnimalDatum[] = rawData
        .map((d) => ({
          name: d.name ?? "",
          speed: +(d.speed ?? 0),
          diet: d.diet as AnimalDatum["diet"],
        }))
        .filter((d) => d.name && d.speed > 0 && ["herbivore", "omnivore", "carnivore"].includes(d.diet));
      setAnimalData(parsed);
    });
  }, []);

  // create graph
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.innerHTML = "";
    }

    if (animalData.length === 0) return;

    const data = [...animalData].sort((a, b) => b.speed - a.speed).slice(0, 20);

    const containerWidth = graphRef.current?.clientWidth ?? 800;
    const containerHeight = graphRef.current?.clientHeight ?? 500;

    const width = Math.max(containerWidth, 600);
    const height = Math.max(containerHeight, 400);
    const margin = { top: 70, right: 60, bottom: 120, left: 80 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = select(graphRef.current!)
      .append<SVGSVGElement>("svg")
      .attr("width", width)
      .attr("height", height);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, max(data, (d) => d.speed) ?? 0])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = scaleOrdinal<string>()
      .domain(["carnivore", "herbivore", "omnivore"])
      .range(["#e74c3c", "#2ecc71", "#3498db"]);

    // Bars
    chart
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.name) ?? 0)
      .attr("y", (d) => yScale(d.speed))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.speed))
      .attr("fill", (d) => colorScale(d.diet))
      .attr("rx", 3);

    // X Axis
    chart
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "11px")
      .style("fill", "white");

    // Y Axis
    chart
      .append("g")
      .call(axisLeft(yScale))
      .selectAll("text")
      .style("fill", "white");

    // Make axis lines and ticks white
    chart.selectAll(".domain").style("stroke", "white");
    chart.selectAll(".tick line").style("stroke", "white");

    // Axis labels
    chart
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("fill", "white")
      .text("Animal");

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("fill", "white")
      .text("Speed (km/h)");

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .text("Top 20 Fastest Animals by Diet");

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right - 120}, ${margin.top})`);

    const diets = ["carnivore", "herbivore", "omnivore"];
    diets.forEach((diet, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 22})`);
      row.append("rect").attr("width", 14).attr("height", 14).attr("fill", colorScale(diet)).attr("rx", 2);
      row
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "12px")
        .style("text-transform", "capitalize")
        .style("fill", "white")
        .text(diet);
    });
  }, [animalData]);

  return (
    <div ref={graphRef} style={{ width: "100%", height: "500px" }} />
  );
}