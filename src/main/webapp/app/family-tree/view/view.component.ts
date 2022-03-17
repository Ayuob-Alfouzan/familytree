import { Component, OnInit } from '@angular/core';
import { ViewFamilyTreeService } from './view.service';
import * as d3 from 'd3';
import { DataModel, FTHierarchyNode, FTHierarchyPointNode } from '../models/family-tree.model';
import { HierarchyPointNode, selection } from 'd3';
import { Data } from '@angular/router';

@Component({
  selector: 'jhi-view-family-tree',
  templateUrl: './view.component.html',
})
export class ViewFamilyTreeComponent implements OnInit {
  treeData: DataModel = {
    name: 'Top Level',
    parent: 'null',
    children: [
      {
        name: 'Level 2: A',
        parent: 'Top Level',
        children: [
          {
            name: 'Son of A',
            parent: 'Level 2: A',
          },
          {
            name: 'Daughter of A',
            parent: 'Level 2: A',
          },
        ],
      },
      {
        name: 'Level 2: B',
        parent: 'Top Level',
      },
      {
        name: 'Level 2: C',
        parent: 'Top Level',
      },
    ],
  };

  margin = { top: 20, right: 90, bottom: 30, left: 90 };
  width = 960 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;
  treemap = d3.tree<DataModel>().size([this.height, this.width]);
  svg!: d3.Selection<SVGGElement, any, HTMLElement, any>;
  root!: FTHierarchyNode<DataModel>;
  i = 0;

  constructor(private service: ViewFamilyTreeService) {}

  ngOnInit(): void {
    this.svg = d3
      .select('div.tree-container')
      .append('svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // declares a tree layout and assigns the size

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(this.treeData, d => d.children);
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    // Collapse after the second level
    this.root.children?.forEach(x => this.collapse(x));
    this.update(this.root);
  }

  update(source: FTHierarchyNode<DataModel>): void {
    // Assigns the x and y position for the nodes
    const treeData = this.treemap(this.root);

    // Compute the new tree layout.
    const nodes = treeData.descendants() as FTHierarchyPointNode<DataModel>[];

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * 180;
    });

    // Update the nodes...
    const node: d3.Selection<
      SVGGElement,
      FTHierarchyPointNode<DataModel>,
      SVGGElement,
      FTHierarchyPointNode<DataModel>
    > = this.svg.selectAll('g.node');
    const data: d3.Selection<SVGGElement, FTHierarchyPointNode<DataModel>, SVGGElement, FTHierarchyPointNode<DataModel>> = node.data(
      nodes,
      (d: any) => d.id || (d.id = ++this.i)
    );

    const nodeEnter = data
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${source.y0 ? source.y0 : 0},${source.x0 ? source.x0 : 0})`)
      .on('click', (x, y) => this.click(x, y));

    nodeEnter
      .append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', d => (d._children ? 'lightsteelblue' : '#fff'));

    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('x', d => (d.children || d._children ? -13 : 13))
      .attr('text-anchor', d => (d.children || d._children ? 'end' : 'start'))
      .text(function (d) {
        return d.data.name;
      });

    const duration = 750;
    // UPDATE
    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Update the node attributes and style
    nodeUpdate
      .select('circle.node')
      .attr('r', 10)
      .style('fill', d => (d._children ? 'lightsteelblue' : '#fff'))
      .attr('cursor', 'pointer');

    // Remove any exiting nodes
    const nodeExit = data
      .exit<FTHierarchyPointNode<DataModel>>()
      .transition()
      .duration(duration)
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .remove();

    // // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // ****************** links section ***************************
    const link: d3.Selection<any, any, SVGGElement, any> = this.svg.selectAll('path.link').data(this.root.links(), (d: any) => d.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', d => {
        if (source.x0 && source.y0) {
          const o = { x: source.x0, y: source.y0 };
          return this.diagonal(o, o);
        } else {
          return null;
        }
      });

    // UPDATE
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', d => this.diagonal(d.source, d.target));

    // Remove any exiting links
    link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', (d: any) => {
        const o = { x: d.x, y: d.y };
        return this.diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  diagonal(s: { x: number; y: number }, d: { x: number; y: number }): string {
    return `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`;
  }

  click(event: any, d: FTHierarchyPointNode<DataModel>): void {
    if (d.children) {
      d._children = d.children;
      d.children = undefined;
    } else {
      d.children = d._children;
      d._children = undefined;
    }
    this.update(d);
  }

  collapse(d: FTHierarchyNode<DataModel>): void {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(it => this.collapse(it));
      d.children = undefined;
    }
  }

  addaPerson(): void {
    this.service.get().subscribe(() => {
      console.log('1');
    });
  }
}
