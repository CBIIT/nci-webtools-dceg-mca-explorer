// draw genes if zoom is at less than 50 MB
function GeneChart(genes) {
    let {
      config,
      geneCanvas,
      geneCtx,
      geneOverlayCanvas,
      geneOverlayCtx
    } = this;
    let { margins, xAxis } = config;
    removeEventListeners(this.geneCanvas);

    if (genes) {
      config.genes = genes;
    } else if (config.genes) {
      genes = config.genes;
    }

    if (!genes || !this.config.zoomWindow) return;

    let getName = gene =>
      gene.strand === '+' ? `${gene.name} →` : `← ${gene.name}`;

    let labelPadding = 5 * (config.scaleSize || 1);
    let labelHeight = 10 * (config.scaleSize || 1);
    let labelConfig = {
      font: `${labelHeight}px ${systemFont}`,
      textAlign: 'center',
      textBaseline: 'middle',
      fillStyle: 'black'
    };

    let rowHeight = 40 * (config.scaleSize || 1) + labelHeight + labelPadding;

    geneCtx.textAlign = 'center';
    geneCtx.textBaseline = 'top';

    setStyles(this.geneCanvasContainer, {
      left: margins.left + 'px',
      maxHeight: rowHeight * 5 + 10 + 'px',
      width: this.canvas.width - margins.left - margins.right + 'px',
      overflowX: 'hidden',
      overflowY: 'auto'
    });

    let genePositions = genes.map(gene => {
      let originalName = gene.name;
      let name = getName(gene);
      let padding = 5 * (config.scaleSize || 1); // horiz. padding between name and gene

      let geneStart = xAxis.scale(gene.transcription_start);
      let geneEnd = xAxis.scale(gene.transcription_end);

      let labelWidth = measureWidth(geneCtx, name);
      let geneWidth = Math.abs(geneEnd - geneStart);
      let width = Math.max(labelWidth, geneWidth);
      let pxCenter = geneStart + geneWidth / 2;
      let pxStart = pxCenter - width / 2;
      let pxEnd = pxCenter + width / 2;

      /*
      let width = labelWidth + padding + range;

      let pxStart = geneStart - padding - labelWidth;
      let pxEnd = geneEnd + padding * 4;
      */

      return {
        ...gene,
        name,
        originalName,
        width,
        pxCenter,
        pxStart,
        pxEnd
      };
    });

    let geneRanges = genePositions.map(gene => {
      let horizPadding = 50;
      return [gene.pxStart - horizPadding, gene.pxEnd + horizPadding];
    });

    let packedGeneRanges = packRanges(geneRanges);
    let currentBounds = this.config.zoomWindow.bounds;
    let numRows = packedGeneRanges.length;
    let txColor = '#aaa';
    let exonColor = '#049372';
    let geneOverlayPositions = [];
    let padding = 10;
    let lastGene = null;
    let pan = {
      mouseDown: false,
      initialX: 0,
      currentX: 0,
      scale: getScale(
        [0, this.geneCanvas.width],
        [0, currentBounds.xMax - currentBounds.xMin]
      )
    };

    geneCanvas.height = rowHeight * numRows;
    geneCanvas.width =
      this.canvas.width - config.margins.left - config.margins.right;

    geneOverlayCanvas.height = geneCanvas.height;
    geneOverlayCanvas.width = geneCanvas.width;

    withSavedContext(geneCtx, ctx => {
      ctx.fillStyle = this.defaultConfig.backgroundColor;
      ctx.fillRect(0, 0, geneCanvas.width, geneCanvas.height);
    });

    const getGeneAtPosition = (x, y) => {
      return geneOverlayPositions.find(pos => {
        return (
          x > pos.x1 - padding &&
          x < pos.x2 + padding &&
          y > pos.y1 - padding &&
          y < pos.y2 + padding
        );
      });
    };

    addEventListener(geneCanvas, 'mousemove', async ev => {
      let { x, y } = viewportToLocalCoordinates(
        ev.clientX,
        ev.clientY,
        geneCanvas
      );
      let gene = getGeneAtPosition(x, y);
      if (
        !pan.mouseDown &&
        gene &&
        gene != lastGene &&
        config.geneTooltipContent
      ) {
        lastGene = gene;
        config.tooltipOpen = true;
        let row = Math.floor(y / rowHeight);
        let showAbove = false; //row > 1 && row > packedGeneRanges.length - 3;
        // console.log('showAbove', showAbove);
        let yOffset = showAbove
          ? row * rowHeight + padding
          : (row + 1) * rowHeight;

        let canvasOffset = getElementOffset(geneCanvas);

        let content = await config.geneTooltipContent(gene.gene, this.tooltip);
        ev.localX = canvasOffset.left + gene.gene.pxCenter;
        ev.localY = canvasOffset.top + yOffset; // ev.clientY //yOffset;
        //  ev.target = document.body;

        //  console.log(ev);

        // console.log('showing tooltip', gene, content, this.geneTooltip, tooltipLocation)
        showTooltip(this.geneTooltip, ev, content, {
          center: true,
          body: true,
          constraints: { xMin: canvasOffset.left }
        });

        /*
        showTooltip(this.geneTooltip, , content);
        */
      } else if (!gene) {
        lastGene = null;
        config.tooltipOpen = false;
        hideTooltip(this.geneTooltip);
      }

      // console.log('found gene', gene);
    });

    addEventListener(document.body, 'click', ev => {
      lastGene = null;
      config.tooltipOpen = false;
      hideTooltip(this.geneTooltip);
    });

    // this.container.style.height = (geneCanvas.height + this.canvas.height) + 'px';

    packedGeneRanges.forEach((geneRow, rowIndex) => {
      let yOffset = rowHeight * rowIndex;
      let xOffset = margins.left;

      geneCtx.save();
      geneCtx.translate(0, yOffset);

      for (let geneRange of geneRow) {
        let geneIndex = geneRanges.indexOf(geneRange);
        let gene = genePositions[geneIndex];
        let geneLabel = genePositions[geneIndex];

        let start = Math.floor(xAxis.scale(gene.transcription_start));
        let end = Math.ceil(xAxis.scale(gene.transcription_end));

        // let start = Math.max(xAxis.scale(gene.transcription_start), xOffset);
        // let end = Math.min(xAxis.scale(gene.transcription_end), genePlotWidth - margins.right);

        geneCtx.save();
        geneCtx.translate(geneLabel.pxCenter, labelHeight);
        renderText(geneCtx, geneLabel.name, labelConfig);
        geneCtx.restore();

        let exonOffsetY = labelHeight + labelPadding;
        let width = Math.abs(end - start);
        let exons = gene.exon_starts.map((e, i) => [
          gene.exon_starts[i],
          gene.exon_ends[i]
        ]);

        //ctx.globalAlpha = 0.25;
        geneCtx.fillStyle = txColor;
        geneCtx.strokeStyle = txColor;
        geneCtx.strokeWidth = 2 * (config.scaleSize || 1);
        geneCtx.beginPath();
        let lineY = 14.5 * (config.scaleSize || 1);
        geneOverlayPositions.push({
          x1: Math.min(geneLabel.pxStart, start),
          x2: Math.max(geneLabel.pxEnd, start + width),
          y1: yOffset + exonOffsetY - labelHeight,
          y2: yOffset + exonOffsetY + 30 * (config.scaleSize || 1),
          gene: gene
        });

        geneCtx.moveTo(start, lineY + exonOffsetY);
        geneCtx.lineTo(start + width, lineY + exonOffsetY);
        geneCtx.stroke();

        // ctx.fillRect(start, 14.5, width, 1);

        exons.forEach(exon => {
          geneCtx.fillStyle = exonColor;
          geneCtx.strokeStyle = exonColor;
          let start = config.xAxis.scale(exon[0]);
          let end = config.xAxis.scale(exon[1]);
          let width = Math.ceil(Math.abs(end - start));
          geneCtx.fillRect(
            start,
            exonOffsetY,
            width,
            30 * (config.scaleSize || 1)
          );
        });
      }

      geneCtx.restore();
    });

    // add event handlers to pan graph
    geneCanvas.style.cursor = 'move';

    addEventListener(geneCanvas, 'mousedown', ev => {
      pan.mouseDown = true;
      pan.initialX = ev.clientX;
    });

    addEventListener(geneCanvas, 'mousemove', ev => {
      if (!pan.mouseDown) return;
      pan.currentX = ev.clientX;
      pan.deltaX = pan.currentX - pan.initialX;
      let deltaX = Math.abs(pan.scale(pan.deltaX) / 1e6).toPrecision(4);
      let title = [
        {
          text: `${pan.deltaX > 0 ? '+' : '-'} ${deltaX} MB`,
          font: `24px ${systemFont}`
        }
      ];

      this.geneOverlayCanvas.style.opacity = 0.5;
      this.geneOverlayCtx.fillStyle = 'white';
      this.geneOverlayCtx.fillRect(
        0,
        0,
        this.geneOverlayCanvas.width,
        this.geneOverlayCanvas.height
      );

      this.geneOverlayCtx.save();
      this.geneOverlayCtx.translate(
        this.geneOverlayCanvas.width / 2,
        Math.min(this.geneOverlayCanvas.height, rowHeight * 5 + 10) / 2
      );
      renderText(this.geneOverlayCtx, title, {
        textAlign: 'center',
        textBaseline: 'center',
        fillStyle: 'black'
      });
      this.geneOverlayCtx.restore();
    });

    addEventListener(document.body, 'mouseup', ev => {
      if (!pan.mouseDown || !pan.deltaX) return;
      pan.mouseDown = false;
      let deltaX = pan.scale(pan.deltaX);
      let bounds = {
        ...currentBounds,
        xMin: currentBounds.xMin + deltaX,
        xMax: currentBounds.xMax + deltaX
      };
      this.config.setZoomWindow({ bounds });
      if (this.config.onPan) {
        this.config.onPan(bounds);
      }
    });
  }