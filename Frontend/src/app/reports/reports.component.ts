import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ChartService } from '../services/chart.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @ViewChild('legendContainer', { static: false }) private legendContainer!: ElementRef; // Ensure legendContainer loads with view
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
          this.chartTitle = data.title;
          this.createSvg();
          this.createScales();
          this.createChartTitle();
          this.drawLineChart();

          // Call createLegend here after data has been set
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

  ngAfterViewInit(): void {
    // Ensure createLegend is called only if reportData is available
    if (this.reportData) {
      this.createLegend();
    }
  }

  private createSvg(): void {
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", "100%") // Make the SVG responsive
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet") // Center the chart
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
  }

  private createScales(): void {
    // Convert each year and percentage to a number explicitly
    const years = this.reportData[0].performance.map((d: any) => Number(d.year));
    const allValues = this.reportData.flatMap((d: any) => d.performance.map((p: any) => Number(p.percentage)));

    // Use d3.extent with type assertion for the xScale domain
    const xExtent = d3.extent(years).map(d => Number(d)) as [number, number];
    this.xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([0, this.width]);

    // Use d3.max with type assertion for yScale domain
    const yMax = Number(d3.max(allValues.map((d: number) => Number(d))) ?? 0);
    if (yMax === undefined) {
      throw new Error('Unable to determine maximum value for yScale');
    }
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
      .attr("class", "chart-title") // Add class for SCSS styling
      .attr("x", this.width / 2) // Center title horizontally
      .attr("y", -this.margin.top / 2) // Position title above the chart
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(this.chartTitle);
  }

  private drawLineChart(): void {
    const line = d3.line()
      .x((d: any) => this.xScale(d.year))
      .y((d: any) => this.yScale(d.percentage));

      // Add title to the SVG for screen readers
  this.svg.append("title").text("AI performance benchmarks over time");

    // Draw the line chart for each benchmark
    this.reportData.forEach((benchmark: any) => {
      this.svg.append("path")
        .datum(benchmark.performance)
        .attr("fill", "none")
        .attr("stroke", this.color(benchmark.name))
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("tabindex", "0")
        .attr("aria-label", `Line chart showing performance for ${benchmark.name}`);
    });

    // Add x-axis
    this.svg.append("g")
    .attr("transform", `translate(0, ${this.height})`)
    .call(d3.axisBottom(this.xScale).tickFormat((d: any) => d.toString()))
    .attr("aria-hidden", "true"); // Hide axes from screen readers if not essential

    // Add y-axis
    this.svg.append("g")
    .call(d3.axisLeft(this.yScale))
    .attr("aria-hidden", "true");

    // Add a dashed line at y = 100
    this.svg.append("line")
      .attr("x1", 0)
      .attr("x2", this.width)
      .attr("y1", this.yScale(100))
      .attr("y2", this.yScale(100))
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5"); // Dashed line

    // Add a label for the dashed line
    this.svg.append("text")
      .attr("x", 10) // Position label closer to the y-axis
      .attr("y", this.yScale(100) - 5) // Position slightly above the line
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .style("fill", "gray")
      .text("Human Performance");
  }

  private createLegend(): void {
    if (!this.reportData) return;

    // Clear any existing legend content
    d3.select(this.legendContainer.nativeElement).selectAll('*').remove();

    const legend = d3.select(this.legendContainer.nativeElement)
      .append("div")
      .attr("class", "legend-box");

    // Add each legend item with matching color
    this.reportData.forEach((benchmark: any) => {
      const color = this.color(benchmark.name); // Fetch color for the legend item

      const legendItem = legend.append("div").attr("class", "legend-item");

      legendItem.append("div")
        .attr("class", "legend-color-box")
        .style("background-color", color) // Apply color from color scale
        .style("border", `1px solid ${color}`); // Additional border to reinforce visibility

      legendItem.append("span")
        .attr("class", "legend-text")
        .text(benchmark.name);
    });
  }
}
