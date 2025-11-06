'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Technology } from '@/app/radar/page';

interface TechnologyRadarProps {
  technologies: Technology[];
}

const TechnologyRadar: React.FC<TechnologyRadarProps> = ({ technologies }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTooltipTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!technologies || !svgRef.current || !tooltipRef.current || !containerRef.current) return;

    const width = 900;
    const height = 900;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const rings = ['Adopt', 'Trial', 'Assess', 'Hold'];
    const quadrants = ['Techniques', 'Tools', 'Platforms', 'Languages & Frameworks'];

    const angleScale = d3.scaleLinear().domain([0, quadrants.length]).range([0, 2 * Math.PI]);
    const radiusScale = d3.scaleLinear().domain([0, rings.length]).range([0, radius]);
    const colorScale = d3.scaleOrdinal<string, string>().domain(quadrants).range(['#56949f', '#286983', '#3e8fb0', '#31748f']);
    const ringColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .html('');

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Draw rings
    g.selectAll('.ring')
      .data(rings)
      .enter()
      .append('circle')
      .attr('class', 'ring')
      .attr('r', (d, i) => radiusScale(rings.length - i))
      .style('fill', (d, i) => ringColors[i])
      .style('stroke', 'hsl(var(--border))');

    // Ring labels
    g.selectAll('.ring-label')
      .data(rings)
      .enter()
      .append('text')
      .attr('class', 'ring-label')
      .attr('y', (d, i) => -radiusScale(i + 1) + 25)
      .attr('text-anchor', 'middle')
      .style('fill', 'hsl(var(--muted-foreground))')
      .style('font-weight', 'normal')
      .style('font-size', '10px')
      .text(d => d.toUpperCase());

    // Draw quadrant lines
    g.selectAll('.quadrant-line')
      .data(quadrants)
      .enter()
      .append('line')
      .attr('class', 'quadrant-line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => Math.cos(angleScale(i) - Math.PI / 4) * radius)
      .attr('y2', (d, i) => Math.sin(angleScale(i) - Math.PI / 4) * radius)
      .style('stroke', 'hsl(var(--border))');

    // Quadrant labels - positioned at corners
    const quadrantPositions = [
      { x: radius - 10, y: -radius + 20, anchor: 'end' },      // Top-right
      { x: radius - 10, y: radius - 10, anchor: 'end' },       // Bottom-right
      { x: -radius + 10, y: radius - 10, anchor: 'start' },    // Bottom-left
      { x: -radius + 10, y: -radius + 20, anchor: 'start' }    // Top-left
    ];

    g.selectAll('.quadrant-label')
      .data(quadrants)
      .enter()
      .append('text')
      .attr('class', 'quadrant-label')
      .attr('x', (d, i) => quadrantPositions[i].x)
      .attr('y', (d, i) => quadrantPositions[i].y)
      .attr('text-anchor', (d, i) => quadrantPositions[i].anchor)
      .style('fill', 'hsl(var(--muted-foreground))')
      .style('font-weight', 'bold')
      .style('font-size', '12px')
      .text(d => d.toUpperCase());

    const tooltip = d3.select(tooltipRef.current);
    const container = containerRef.current;

    const showTooltip = (event: MouseEvent, d: Technology) => {
      if (hideTooltipTimer.current) {
        clearTimeout(hideTooltipTimer.current);
        hideTooltipTimer.current = null;
      }
      tooltip.style('visibility', 'visible')
        .html(`
          <div class="font-bold text-sm">${d.name}</div>
          <div class="text-xs text-muted-foreground">${d.quadrant} / ${d.ring}</div>
          <p class="mt-1 text-sm">${d.description || ''}</p>
          ${d.source_url ? `<a href="${d.source_url}" target="_blank" rel="noopener noreferrer" class="text-primary underline text-sm mt-2 inline-block">Learn more</a>` : ''}
        `);
    };

    const moveTooltip = (event: MouseEvent) => {
      const [x, y] = d3.pointer(event, container);
      tooltip.style('top', `${y + 15}px`).style('left', `${x + 15}px`);
    };

    const hideTooltip = () => {
      hideTooltipTimer.current = setTimeout(() => {
        tooltip.style('visibility', 'hidden');
      }, 200);
    };

    tooltip
      .on('mouseover', () => {
        if (hideTooltipTimer.current) {
          clearTimeout(hideTooltipTimer.current);
          hideTooltipTimer.current = null;
        }
      })
      .on('mouseout', () => {
        hideTooltip();
      });

    // Plot blips
    const blips = g.selectAll('.blip')
      .data(technologies)
      .enter()
      .append('g')
      .attr('class', 'blip')
      .attr('transform', d => {
        const quadrantIndex = quadrants.indexOf(d.quadrant);
        const ringIndex = rings.indexOf(d.ring);
        const angle = angleScale(quadrantIndex) - Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        const r = radiusScale(ringIndex + 0.5 + (Math.random() - 0.5) * 0.5);
        return `translate(${Math.cos(angle) * r}, ${Math.sin(angle) * r})`;
      });

    blips.append('circle')
      .attr('r', 5)
      .style('fill', d => colorScale(d.quadrant))
      .style('stroke', 'hsl(var(--background))')
      .style('stroke-width', 1)
      .on('mouseover', (event, d) => showTooltip(event, d))
      .on('mousemove', (event) => moveTooltip(event))
      .on('mouseout', () => hideTooltip());

    blips.append('text')
      .attr('dy', '0.35em')
      .attr('x', 10)
      .style('fill', 'hsl(var(--foreground))')
      .style('font-size', '12px')
      .text(d => d.name);

  }, [technologies]);

  return (
    <div ref={containerRef} className="relative flex justify-center">
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        className="tooltip absolute z-10 invisible bg-rosePine-surface text-rosePine-text border border-rosePine-highlight-med p-3 rounded-lg shadow-lg max-w-xs"
      ></div>
    </div>
  );
};

export default TechnologyRadar;
