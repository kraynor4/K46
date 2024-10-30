import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChartService } from '../services/chart.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  private svg: any;
  private margin = 30;
  private width = 350; // Smaller chart width
  private height = 300; // Smaller chart height
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private color: any;
  private pie: any;
  private arc: any;
  private outerArc: any;
  sumChartData: any;
  chartTitle: string = ''; // Holds the title from MongoDB

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.chartService.getSumChartData().subscribe(
      data => {
        if (data && data.models) {
          this.sumChartData = data.models;
          this.chartTitle = data.title; // Retrieve title from the data
          this.createSvg();
          this.createColors();
          this.createChartTitle();
          this.createDonutChart();
          this.createLegend();
        } else {
          console.error('Error: Received empty or invalid data:', data);
        }
      },
      error => {
        console.error('Error fetching summary chart data:', error);
      }
    );
  }

  private createChartTitle(): void {
    this.svg.append("text")
      .attr("class", "chart-title") // Add class for SCSS styling
      .attr("x", 0)
      .attr("y", -this.height / 2 - this.margin / 2) // Position title above the chart
      .attr("text-anchor", "middle")
      .text(this.chartTitle);
  }

  private createSvg(): void {
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 2 + 50}`) // Add extra space for title
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", `translate(${(this.width + this.margin) / 2}, ${(this.height + this.margin + 50) / 2})`);

    this.svg.append("g").attr("class", "slices");
    this.svg.append("g").attr("class", "labels");
    this.svg.append("g").attr("class", "lines");

    this.pie = d3.pie<any>().sort(null).value((d: any) => d.value);
  }

  private createColors(): void {
    const companies = this.sumChartData.map((d: any) => d.company);
    this.color = d3.scaleOrdinal()
      .domain(companies)
      .range(d3.schemeCategory10);
  }

  private createDonutChart(): void {
    const data = this.sumChartData.map((model: any) => ({
      key: model.name,
      value: 1,
      company: model.company
    }));

    const pieData = this.pie(data);

    this.arc = d3.arc()
      .innerRadius(this.radius * 0.5)
      .outerRadius(this.radius * 0.8);

    this.outerArc = d3.arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    this.svg.selectAll('allSlices')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', this.arc)
      .attr('fill', (d: any) => this.color(d.data.company))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    this.svg.selectAll('allPolylines')
      .data(pieData)
      .enter()
      .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', (d: any) => {
        const posA = this.arc.centroid(d);
        const posB = this.outerArc.centroid(d);
        const posC = this.outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = this.radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });

    this.svg.selectAll('allLabels')
      .data(pieData)
      .enter()
      .append('text')
      .text((d: any) => d.data.key)
      .attr('transform', (d: any) => {
        const pos = this.outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', (d: any) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return (midAngle < Math.PI ? 'start' : 'end');
      })
      .style('font-size', '10px');
  }

  private createLegend(): void {
    const companies = Array.from(new Set(this.sumChartData.map((d: any) => d.company)));

    const legendWidth = this.width;
    const legendItemWidth = 80;
    const legendPadding = 10;
    const itemsPerRow = Math.floor(legendWidth / legendItemWidth);

    const legendHeight = Math.ceil(companies.length / itemsPerRow) * 15 + legendPadding * 2;

    const legendContainer = this.svg.append("g")
      .attr("class", "legend-container")
      .attr("transform", `translate(${-legendWidth / 2}, ${this.radius + 30})`);

    legendContainer.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", "#f9f9f9")
      .attr("stroke", "#ccc")
      .attr("rx", 5)
      .attr("ry", 5);

    companies.forEach((company, i) => {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;

      const xOffset = col * legendItemWidth + legendPadding;
      const yOffset = row * 20 + legendPadding + 10;

      legendContainer.append("rect")
        .attr("x", xOffset)
        .attr("y", yOffset - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", this.color(company));

      legendContainer.append("text")
        .attr("x", xOffset + 15)
        .attr("y", yOffset - 2)
        .text(company)
        .style("font-size", "10px")
        .attr("alignment-baseline", "middle");
    });
  }
}
