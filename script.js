const movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

d3.json(movieDataUrl).then(movieData => {
  const hierarchy = d3.hierarchy(movieData, node => node.children)
    .sum(node => node.value)
    .sort((node1, node2) => node2.value - node1.value);

  const createTreeMap = d3.treemap().size([1000, 600]);
  createTreeMap(hierarchy);

  const movieTiles = hierarchy.leaves();

  const block = canvas.selectAll('g')
    .data(movieTiles)
    .enter().append('g')
    .attr('transform', movie => `translate(${movie.x0}, ${movie.y0})`);

  const categories = ['Action', 'Drama', 'Adventure', 'Family', 'Animation', 'Comedy', 'Biography'];
  const colors = ['orange', 'lightgreen', 'coral', 'lightblue', 'pink', 'khaki', 'tan'];
  const colorScale = d3.scaleOrdinal().domain(categories).range(colors);

  block.append('rect')
    .attr('class', 'tile')
    .attr('fill', movie => colorScale(movie.data.category))
    .attr('data-name', movie => movie.data.name)
    .attr('data-category', movie => movie.data.category)
    .attr('data-value', movie => movie.data.value)
    .attr('width', movie => movie.x1 - movie.x0)
    .attr('height', movie => movie.y1 - movie.y0)
    .on('mouseover', movie => {
      tooltip.transition().style('visibility', 'visible');
      const revenue = movie.data.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      tooltip.html(`$ ${revenue}<hr />${movie.data.name}`);
      tooltip.attr('data-value', movie.data.value);
    })
    .on('mouseout', () => {
      tooltip.transition().style('visibility', 'hidden');
    });

  block.append('text')
    .text(movie => movie.data.name)
    .attr('x', 5)
    .attr('y', 20);
});
