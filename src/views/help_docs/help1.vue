<template>
    <div>
      <nav class="navbar">
        <div class="logo">Unbounded Intelligence</div>
        <ul class="nav-links">
          <li><a href="#">Research</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">Safety</a></li>
          <li><a href="#">Company</a></li>
        </ul>
      </nav>
      <header class="header">
        <h1>How to use Image Processing</h1>
        <p>July 7, 2022</p>
        <button class="change_language_button">Translate ↗</button>
      </header>
      <div class="main-content">
        <aside class="sidebar">
          <ul>
            <li><a href="#step1" @click.prevent="scrollToSection('step1')">Step 1: Launch the Editor</a></li>
            <li><a href="#step2" @click.prevent="scrollToSection('step2')">Step 2: Prepare the Image File</a></li>
            <li><a href="#step3" @click.prevent="scrollToSection('step3')">Step 3: Drag the Image into the Editor</a></li>
            <li><a href="#step4" @click.prevent="scrollToSection('step4')">Step 4: Right-Click to Access Image Processing Options</a></li>
            <li><a href="#step5" @click.prevent="scrollToSection('step5')">Step 5: Review and Edit the Output</a></li>
            <li><a href="#step6" @click.prevent="scrollToSection('step6')">Step 6: Apply Further Image Processing (Optional)</a></li>
            <li><a href="#final-thoughts" @click.prevent="scrollToSection('final-thoughts')">Final Thoughts</a></li>
          </ul>
        </aside>
        <section class="content">
          <h2>Image processing has become a vital part of modern editor tools...</h2>
          <h3 id="step1">Step 1: Launch the Editor</h3>
          <p>To start with, you need an editor that supports drag-and-drop functionality and has built-in image processing features...</p>
          <h3 id="step2">Step 2: Prepare the Image File</h3>
          <p>Ensure that your image file is accessible on your computer. It could be in common formats like JPEG, PNG, or TIFF...</p>
          <h3 id="step3">Step 3: Drag the Image into the Editor</h3>
          <p>Open your editor and make sure it is ready to receive a new file...</p>
          <h3 id="step4">Step 4: Right-Click to Access Image Processing Options</h3>
          <p>Once the image is inside the editor: Right-click on the Image: This action will reveal a contextual menu with various image processing options...</p>
          <h3 id="step5">Step 5: Review and Edit the Output</h3>
          <p>If you performed OCR, review the extracted text to ensure accuracy. Editors often highlight text that was ambiguously recognized for user verification...</p>
          <h3 id="step6">Step 6: Apply Further Image Processing (Optional)</h3>
          <p>If needed, you can perform additional image processing tasks such as: Resizing and Cropping, Filtering and Enhancing, Annotations...</p>
          <h3 id="final-thoughts">Final Thoughts</h3>
          <p>Dragging an image into an editor and applying image processing tasks like OCR or querying the image can greatly enhance productivity and provide valuable insights...</p>
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  </script>
  
  <style scoped>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .navbar .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .navbar .nav-links {
    list-style: none;
    display: flex;
    gap: 20px;
  }
  
  .navbar .nav-links li {
    display: inline;
  }
  
  .navbar .nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  
  .header {
    text-align: center;
    padding: 50px 20px;
    background-color: #f8f8f8;
  }
  
  .header h1 {
    font-size: 2.5rem;
    margin: 0;
  }
  
  .header p {
    font-size: 1rem;
    color: #666;
  }
  
  .change_language_button {
    padding: 10px 20px;
    font-size: 1rem;
    margin-top: 20px;
    background-color: #000;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  
  .change_language_button:hover {
    background-color: #333;
  }
  
  .main-content {
    display: flex;
  }
  
  .sidebar {
    width: 20%;
    padding: 20px;
    background-color: #f0f0f0;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin-bottom: 10px;
  }
  
  .sidebar ul li a {
    text-decoration: none;
    color: #333;
    cursor: pointer;
  }
  
  .content {
    width: 80%;
    padding: 20px;
  }
  
  .content h2 {
    font-size: 1.5rem;
    margin-top: 0;
  }
  
  .content h3 {
    font-size: 1.25rem;
    margin-top: 20px;
  }
  
  .content p {
    font-size: 1rem;
    margin-bottom: 20px;
  }
  </style>
  