import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ViewFamilyTreeService } from './view.service';
import * as d3 from 'd3';
import { PersonModel, FTHierarchyNode, FTHierarchyPointNode } from '../models/family-tree.model';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'jhi-view-family-tree',
  templateUrl: './view.component.html',
})
export class ViewFamilyTreeComponent implements OnInit, AfterViewInit {
  @ViewChild('treeContainer', { read: ElementRef }) treeDiv?: ElementRef<any>;

  selectedPerson?: PersonModel;
  selectedPersonParent?: PersonModel;
  treeData!: PersonModel;
  anon = false;

  margin = { top: 32, right: 32, bottom: 32, left: 32 };
  width = 2000 - this.margin.left - this.margin.right;
  height = 650 - this.margin.top - this.margin.bottom;
  treemap!: d3.TreeLayout<PersonModel>;
  svg!: d3.Selection<SVGGElement, any, HTMLElement, any>;
  root!: FTHierarchyNode<PersonModel>;
  i = 0;
  maxDepth: { depth: number; count: number }[] = [];

  constructor(private service: ViewFamilyTreeService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.view === 'ANON') {
        this.anon = true;
      }

      console.log(data);
      this.treeData = data.data;
      this.selectedPerson = data.data;
      this.setup();
    });
  }

  ngAfterViewInit(): void {
    this.positionDiv();
  }

  increaseSize(height: number): void {
    this.height = height - this.margin.top - this.margin.bottom;

    this.treemap = d3.tree<PersonModel>().size([this.height, this.width]);

    d3.select('svg').attr('height', this.height + this.margin.top + this.margin.bottom);

    this.root.x0 = this.height / 2;
    this.root.y0 = 0;
    this.root.x = this.height / 2;
    this.root.y = 0;

    this.update(this.root);
  }

  positionDiv(): void {
    if (this.treeDiv) {
      this.treeDiv.nativeElement.scrollTop = this.treeDiv.nativeElement.scrollHeight / 2 - this.treeDiv.nativeElement.offsetHeight / 2;
      this.treeDiv.nativeElement.scrollLeft = 0;
    }
  }

  refreshTreeData(): void {
    this.service.get(this.treeData.familyTreeId).subscribe(result => {
      this.treeData = result;
      this.assignData(false);
    });
  }

  setup(): void {
    this.svg = d3
      .select('div.tree-container')
      .append('svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // declares a tree layout and assigns the size
    this.treemap = d3.tree<PersonModel>().size([this.height, this.width]);

    this.assignData();
  }

  assignData(collapse = true): void {
    // Assigns parent, children, height, depth
    this.root = d3.hierarchy<PersonModel>(this.treeData, d => d.children);
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    // Collapse after the second level
    if (collapse) {
      this.root.children?.forEach(x => this.collapse(x));
    }

    this.update(this.root);
  }

  update(source: FTHierarchyNode<PersonModel>): void {
    this.maxDepth = [];

    // Assigns the x and y position for the nodes
    const treeData = this.treemap(this.root);

    // Compute the new tree layout.
    const nodes = treeData.descendants() as FTHierarchyPointNode<PersonModel>[];

    // Normalize for fixed-depth.
    nodes.forEach(d => {
      this.setMaxDepth(d);
      return (d.y = d.depth * 150);
    });

    // ****************** Nodes section ***************************
    // Update the nodes...
    const node: d3.Selection<any, FTHierarchyPointNode<PersonModel>, SVGGElement, FTHierarchyPointNode<PersonModel>> = this.svg
      .selectAll('g.node')
      .data(nodes, (d: any) => d.id || (d.id = ++this.i));

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${source.y0 !== undefined ? source.y0 : 0},${source.x0 !== undefined ? source.x0 : 0})`)
      .on('click', (x, y) => this.click(x, y))
      .on('dblclick', (x, y) => this.dblclick(x, y))
      .on('doubletap', (x, y) => this.dblclick(x, y));

    nodeEnter
      .append('ellipse')
      .attr('class', d => `node ${d.data.gender.toLowerCase()}`)
      .attr('rx', 1e-6)
      .attr('ry', 1e-6);

    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .attr('cursor', 'pointer');

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
      .select('ellipse.node')
      .attr('rx', 30)
      .attr('ry', 20)
      .classed('have-children', d => (d._children ? true : false))
      .classed('selected', d => d.data.id === this.selectedPerson?.id)
      .attr('cursor', 'pointer');

    // Remove any exiting nodes
    const nodeExit = node
      .exit<FTHierarchyPointNode<PersonModel>>()
      .transition()
      .duration(duration)
      .attr('transform', d => `translate(${source.y !== undefined ? source.y : d.y},${source.x !== undefined ? source.x : d.x})`)
      .remove();

    // On exit reduce the node size to 0
    nodeExit.select('ellipse').attr('rx', 1e-6).attr('ry', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // ****************** links section ***************************
    const links = treeData.descendants().slice(1);
    const link: d3.Selection<any, any, SVGGElement, any> = this.svg.selectAll('path.link').data(links, (d: any) => d.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', () => {
        if (source.x0 !== undefined && source.y0 !== undefined) {
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
      .attr('d', d => this.diagonal(d, d.parent));

    // Remove any exiting links
    link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', () => {
        if (source.x !== undefined && source.y !== undefined) {
          const o = { x: source.x, y: source.y };
          return this.diagonal(o, o);
        } else {
          return null;
        }
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    this.resetHighet();
  }

  resetHighet(): void {
    let max = 0;
    this.maxDepth.forEach(x => (x.count > max ? (max = x.count) : null));

    if (max > 10 && max * 70 >= this.height + 100) {
      this.increaseSize(max * 70);
    }
  }

  setMaxDepth(d: FTHierarchyPointNode<PersonModel>): void {
    const depth = this.maxDepth.find(x => x.depth === d.depth);

    if (depth) {
      depth.count = depth.count + 1;
    } else {
      this.maxDepth.push({ depth: d.depth, count: 1 });
    }
  }

  diagonal(s: { x: number; y: number }, d: { x: number; y: number }): string {
    return `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`;
  }

  dblclick(event: any, d: FTHierarchyPointNode<PersonModel>): void {
    if (d.children) {
      d._children = d.children;
      d.children = undefined;
    } else {
      d.children = d._children;
      d._children = undefined;
    }
    this.update(d);

    // collapse others on the same level // TODO fix node and link exit location
    if (d.children && d.parent) {
      // this.collapseOthers(d.id, d.parent);
    }
  }

  click(event: any, d: FTHierarchyPointNode<PersonModel>): void {
    this.selectedPerson = d.data;
    this.selectedPersonParent = d.parent?.data;
    this.update(d);
  }

  collapseOthers(id: string | undefined, parent: FTHierarchyNode<PersonModel>): void {
    if (id !== undefined && parent.children) {
      parent.children.forEach(d => {
        if (d.id !== undefined && d.id !== id) {
          this.collapse(d);
          this.update(d);
        }
      });
    }
  }

  collapse(d: FTHierarchyNode<PersonModel>): void {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(it => this.collapse(it));
      d.children = undefined;
    }
  }

  gotAddedPerson(person: PersonModel): void {
    this.selectedPerson = person;
    this.refreshTreeData();
  }
}
