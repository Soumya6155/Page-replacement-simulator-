// DOM Elements
const refStringInput = document.getElementById('refString');
const frameCountInput = document.getElementById('frameCount');
const algButtons = document.querySelectorAll('#algToggle button');
const gridContainer = document.getElementById('grid-container');

// KPI Elements
const kpiFaults = document.getElementById('kpi-faults');
const kpiHits = document.getElementById('kpi-hits');
const kpiRate = document.getElementById('kpi-rate');

// State Variables
let currentAlgorithm = 'FIFO';

// Event Listeners
refStringInput.addEventListener('input', runSimulation);
frameCountInput.addEventListener('input', runSimulation);

algButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Update active button styling
    algButtons.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update state and rerun
    currentAlgorithm = e.target.getAttribute('data-alg');
    runSimulation();
  });
});

// Main Execution
function runSimulation() {
  const refString = refStringInput.value;
  const frameCount = parseInt(frameCountInput.value, 10);
  
  if (isNaN(frameCount) || frameCount < 1) return;

  // Parse reference string into an array of strings/numbers
  const pages = refString.split(',')
    .map(s => s.trim())
    .filter(s => s !== '');

  let frames = [];
  let steps = [];
  let faults = 0;
  let hits = 0;
  let lastUsed = {}; // For LRU

  // Algorithm processing loop
  pages.forEach((page, currentIndex) => {
    let isFault = false;
    let evicted = null;

    if (frames.includes(page)) {
      hits++;
      lastUsed[page] = currentIndex;
    } else {
      isFault = true;
      faults++;

      if (frames.length < frameCount) {
        frames.push(page);
        lastUsed[page] = currentIndex;
      } else {
        // Eviction Logic
        if (currentAlgorithm === 'FIFO') {
          evicted = frames[0];
          frames.shift();
          frames.push(page);
          lastUsed[page] = currentIndex;
        } 
        else if (currentAlgorithm === 'LRU') {
          let lruPage = frames[0];
          let minIndex = lastUsed[lruPage];
          for (let i = 1; i < frames.length; i++) {
            if (lastUsed[frames[i]] < minIndex) {
              minIndex = lastUsed[frames[i]];
              lruPage = frames[i];
            }
          }
          evicted = lruPage;
          let idx = frames.indexOf(lruPage);
          frames[idx] = page;
          lastUsed[page] = currentIndex;
        } 
        else if (currentAlgorithm === 'Optimal') {
          let farthest = currentIndex;
          let pageToReplace = frames[0];
          for (let i = 0; i < frames.length; i++) {
            let nextUse = pages.slice(currentIndex + 1).indexOf(frames[i]);
            if (nextUse === -1) {
              pageToReplace = frames[i];
              break;
            }
            if (nextUse + currentIndex + 1 > farthest) {
              farthest = nextUse + currentIndex + 1;
              pageToReplace = frames[i];
            }
          }
          evicted = pageToReplace;
          let idx = frames.indexOf(pageToReplace);
          frames[idx] = page;
        }
      }
    }

    // Save step state for UI generation
    steps.push({ page, frames: [...frames], isFault, evicted });
  });

  updateDashboard(faults, hits, pages.length);
  renderGrid(steps, frameCount);
}

// UI Updates
function updateDashboard(faults, hits, total) {
  kpiFaults.textContent = faults;
  kpiHits.textContent = hits;
  const rate = total > 0 ? ((hits / total) * 100).toFixed(1) : 0;
  kpiRate.textContent = `${rate}%`;
}

function renderGrid(steps, frameCapacity) {
  gridContainer.innerHTML = ''; // Clear existing grid

  steps.forEach(step => {
    // Column wrapper
    const colDiv = document.createElement('div');
    colDiv.className = 'step-col';

    // Requested Page
    const reqDiv = document.createElement('div');
    reqDiv.className = 'req-page';
    reqDiv.textContent = step.page;
    colDiv.appendChild(reqDiv);

    // Frame Stack
    const stackDiv = document.createElement('div');
    stackDiv.className = 'frames-stack';

    for (let i = 0; i < frameCapacity; i++) {
      const cellDiv = document.createElement('div');
      const pageInFrame = step.frames[i];
      const isNewEntry = step.isFault && pageInFrame === step.page;

      cellDiv.className = 'frame-cell';
      
      if (!pageInFrame) {
        cellDiv.classList.add('frame-empty');
        cellDiv.textContent = '-';
      } else {
        cellDiv.classList.add('frame-filled');
        cellDiv.textContent = pageInFrame;
        if (isNewEntry) {
          cellDiv.classList.add('frame-new');
        }
      }
      stackDiv.appendChild(cellDiv);
    }
    colDiv.appendChild(stackDiv);

    // Status Badge
    const badgeDiv = document.createElement('div');
    badgeDiv.className = `status-badge ${step.isFault ? 'badge-fault' : 'badge-hit'}`;
    badgeDiv.textContent = step.isFault ? 'Fault' : 'Hit';
    colDiv.appendChild(badgeDiv);

    // Eviction Text (if applicable)
    if (step.evicted) {
      const evictDiv = document.createElement('div');
      evictDiv.className = 'evicted-text';
      evictDiv.innerHTML = `Dropped: <span>${step.evicted}</span>`;
      colDiv.appendChild(evictDiv);
    }

    gridContainer.appendChild(colDiv);
  });
}

// Initial Run
runSimulation();