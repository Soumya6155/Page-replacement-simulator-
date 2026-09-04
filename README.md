# Page Replacement Visualizer

An interactive web tool designed to simulate, analyze, and visualize Operating System memory allocation and page replacement algorithms in real time.

---

## 📌 Overview

The **Page Replacement Visualizer** is an educational application built to demonstrate virtual memory management concepts. Rather than performing manual calculations, this tool processes custom page reference sequences, simulates page frame management across multiple algorithms, and renders step-by-step visual memory matrices alongside live performance analytics.

---

## 🚀 Key Features

* **Interactive Control Panel**: Configure custom page reference strings and set physical memory frame capacity between 2 and 7 frames.


* **Real-Time Simulation**: Run and compare page replacement algorithms instantly on parameter changes.


* **Step-by-Step Memory Matrix**: Visual vertical stack showing current frame states, highlighting new page entries, hit/fault status badges, and evicted pages.


* **Performance Dashboard**: Live metrics displaying **Total Faults**, **Total Hits**, and overall **Hit Rate %**.



---

## ⚡ Supported Algorithms

* **FIFO (First-In, First-Out)**: Replaces the page that was loaded into frame memory earliest.


* **LRU (Least Recently Used)**: Replaces the page that has not been accessed for the longest time in past requests.


* **Optimal**: Replaces the page that will not be needed for the longest time in future requests.


* **LFU (Least Frequently Used)**: Replaces the page with the lowest overall reference count.



---

## 🛠️ Tech Stack

* **HTML5**: Structured interface layout for controls and visual memory stack display.


* **CSS3**: Custom CSS variables, card layouts, responsive flexbox grids, and visual status badges.


* **JavaScript (Vanilla)**: Core simulation engine, algorithm execution, array manipulation, and dynamic DOM rendering.



---

## 📂 File Structure

```text
├── index.html    # Core markup and UI layout
├── style.css     # UI styling and visual components
└── script.js    # Simulation engine and DOM updates

```


2. **Run the Application**
Open `index.html` directly in any modern web browser—no external dependencies or build tools required.

**deploy**
https://page-replacement-visualizor.vercel.app/
