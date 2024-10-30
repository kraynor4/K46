import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChartService } from '../services/chart.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  private svg: any;
  private margin = { top: 50, right: 30, bottom: 50, left: 50 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private color: any;
  private xScale: any;
  private yScale: any;
  reportData: any;
  chartTitle: string = '';

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.chartService.getRepChartData().subscribe(
      data => {
        if (data && data.benchmarks) {
          this.reportData = data.benchmarks;
          this.chartTitle = data.title; // Retrieve title from the data
          this.createSvg();
          this.createScales();
          this.createChartTitle();
          this.drawLineChart();
          this.createLegend();
        } else {
          console.error('Error: Received empty or invalid data:', data);
        }
      },
      error => {
        console.error('Error fetching report chart data:', error);
      }
    );
  }

  private createSvg(): void {
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
  }

  private createScales(): void {
    const years = this.reportData[0].performance.map((d: any) => d.year);
    const allValues = this.reportData.flatMap((d: any) => d.performance.map((p: any) => p.percentage));

    // Check and assert types for xScale
    const xExtent = d3.extent(years) as [number, number] | [undefined, undefined];
    const xDomain: [number, number] = [xExtent[0] ?? 0, xExtent[1] ?? 0]; // Use 0 as fallback if undefined

    this.xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, this.width]);

    // Check and assert types for yScale
    const maxYValue = d3.max(allValues) as number | undefined;
    const yMax = maxYValue ?? 100; // Fallback to 100 if undefined

    this.yScale = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([this.height, 0]);

    // Define color scale for different benchmarks
    this.color = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(this.reportData.map((d: any) => d.name));
  }

  private createChartTitle(): void {
    this.svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", -this.margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("class", "chart-title")
      .text(this.chartTitle);
  }

  private drawLineChart(): void {
    // Line generator
    const line = d3.line()
      .x((d: any) => this.xScale(d.year))
      .y((d: any) => this.yScale(d.percentage));

    // Add lines for each benchmark
    this.reportData.forEach((benchmark: any) => {
      this.svg.append("path")
        .datum(benchmark.performance)
        .attr("fill", "none")
        .attr("stroke", this.color(benchmark.name))
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    // Add x-axis
    this.svg.append("g")
      .attr("transform", `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.xScale).tickFormat((d: any) => d3.format("d")(d as number)));

    // Add y-axis
    this.svg.append("g")
      .call(d3.axisLeft(this.yScale));
  }

  private createLegend(): void {
    const legend = this.svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${this.width - 150}, 0)`);

    this.reportData.forEach((benchmark: any, i: number) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", this.color(benchmark.name));

      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("class", "legend-text")
        .text(benchmark.name)
        .style("font-size", "12px");
    });
  }
}
