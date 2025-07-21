// Cooking Celebration App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get all the DOM elements
    const photoUpload = document.getElementById('photoUpload');
    const photoPreview = document.getElementById('photoPreview');
    const previewImg = document.getElementById('previewImg');
    const supportMessage = document.getElementById('supportMessage');
    const includeRecipe = document.getElementById('includeRecipe');
    const recipeSection = document.getElementById('recipeSection');
    const recipeInput = document.getElementById('recipeInput');
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const outputSection = document.getElementById('output');
    const outputPhoto = document.getElementById('outputPhoto');
    const outputMessage = document.getElementById('outputMessage');
    const recipeDisplay = document.getElementById('recipeDisplay');
    const outputRecipe = document.getElementById('outputRecipe');
    const currentDate = document.getElementById('currentDate');
    const includeBibleVerse = document.getElementById('includeBibleVerse');
    const bibleVerseDisplay = document.getElementById('bibleVerseDisplay');
    const verseContent = document.getElementById('verseContent');
    const verseReference = document.getElementById('verseReference');

    let uploadedPhotoSrc = '';
    let currentBibleVerse = null;

    // Handle photo upload and preview
    photoUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Check if it's an image file
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                photoUpload.value = '';
                return;
            }

            // Check file size (limit to 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Please select an image smaller than 10MB.');
                photoUpload.value = '';
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                uploadedPhotoSrc = e.target.result;
                previewImg.src = uploadedPhotoSrc;
                photoPreview.classList.remove('hidden');
                
                // Add a smooth fade-in effect
                photoPreview.style.opacity = '0';
                setTimeout(() => {
                    photoPreview.style.transition = 'opacity 0.3s ease';
                    photoPreview.style.opacity = '1';
                }, 10);
            };
            
            reader.readAsDataURL(file);
        } else {
            // Hide preview if no file selected
            photoPreview.classList.add('hidden');
            uploadedPhotoSrc = '';
        }
    });

    // Handle recipe checkbox toggle
    includeRecipe.addEventListener('change', function() {
        if (this.checked) {
            recipeSection.classList.remove('hidden');
            // Add smooth slide-down effect
            recipeSection.style.opacity = '0';
            recipeSection.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                recipeSection.style.transition = 'all 0.3s ease';
                recipeSection.style.opacity = '1';
                recipeSection.style.transform = 'translateY(0)';
            }, 10);
        } else {
            recipeSection.classList.add('hidden');
            recipeInput.value = ''; // Clear recipe input when hidden
        }
    });

    // Function to fetch random Bible verse
    async function fetchRandomBibleVerse() {
        try {
            // Array of popular inspirational verses for fallback
            const fallbackVerses = [
                { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
                { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.", reference: "Jeremiah 29:11" },
                { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
                { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
                { text: "And we know that in all things God works for the good of those who love him.", reference: "Romans 8:28" }
            ];

            // Try to fetch from bible-api.com with a random verse
            const randomBooks = ['john', 'psalms', 'proverbs', 'philippians', 'romans', 'corinthians', 'ephesians'];
            const randomBook = randomBooks[Math.floor(Math.random() * randomBooks.length)];
            const randomChapter = Math.floor(Math.random() * 10) + 1; // 1-10
            const randomVerse = Math.floor(Math.random() * 20) + 1; // 1-20
            
            const response = await fetch(`https://bible-api.com/${randomBook}+${randomChapter}:${randomVerse}`, {
                method: 'GET',
                timeout: 5000
            });

            if (response.ok) {
                const data = await response.json();
                if (data.text && data.reference) {
                    return {
                        text: data.text.replace(/[\r\n]+/g, ' ').trim(),
                        reference: data.reference
                    };
                }
            }
        } catch (error) {
            console.log('Bible API unavailable, using fallback verse');
        }

        // Use fallback verse if API fails
        const randomFallback = fallbackVerses[Math.floor(Math.random() * fallbackVerses.length)];
        return randomFallback;
    }

    // Handle form generation
    generateBtn.addEventListener('click', async function() {
        // Validate required fields
        if (!uploadedPhotoSrc) {
            alert('Please upload a photo first!');
            photoUpload.focus();
            return;
        }

        if (!supportMessage.value.trim()) {
            alert('Please enter a supportive message!');
            supportMessage.focus();
            return;
        }

        // Fetch Bible verse if requested
        if (includeBibleVerse.checked) {
            try {
                generateBtn.textContent = 'Loading verse...';
                generateBtn.disabled = true;
                currentBibleVerse = await fetchRandomBibleVerse();
            } catch (error) {
                console.error('Error fetching Bible verse:', error);
                currentBibleVerse = {
                    text: "Give thanks to the Lord, for he is good; his love endures forever.",
                    reference: "Psalm 107:1"
                };
            } finally {
                generateBtn.textContent = 'Generate Celebration';
                generateBtn.disabled = false;
            }
        }

        // Generate the celebration card
        generateCelebration();
    });

    // Handle print functionality
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // Generate celebration card function
    function generateCelebration() {
        // Set the photo
        outputPhoto.src = uploadedPhotoSrc;
        
        // Set the message
        outputMessage.textContent = supportMessage.value.trim();
        
        // Handle recipe display
        if (includeRecipe.checked && recipeInput.value.trim()) {
            outputRecipe.textContent = recipeInput.value.trim();
            recipeDisplay.classList.remove('hidden');
        } else {
            recipeDisplay.classList.add('hidden');
        }
        
        // Handle Bible verse display
        if (includeBibleVerse.checked && currentBibleVerse) {
            verseContent.textContent = `"${currentBibleVerse.text}"`;
            verseReference.textContent = `- ${currentBibleVerse.reference}`;
            bibleVerseDisplay.classList.remove('hidden');
        } else {
            bibleVerseDisplay.classList.add('hidden');
        }
        
        // Set current date
        const today = new Date();
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDate.textContent = today.toLocaleDateString('en-US', dateOptions);
        
        // Show the output section with animation
        outputSection.classList.remove('hidden');
        outputSection.style.opacity = '0';
        outputSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            outputSection.style.transition = 'all 0.5s ease';
            outputSection.style.opacity = '1';
            outputSection.style.transform = 'translateY(0)';
        }, 10);
        
        // Show print button
        printBtn.classList.remove('hidden');
        
        // Scroll to the output section
        setTimeout(() => {
            outputSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 200);
        
        // Add success feedback
        generateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            generateBtn.style.transform = 'scale(1)';
        }, 150);
    }

    // Add form validation on input
    supportMessage.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '#27AE60';
        } else {
            this.style.borderColor = '';
        }
    });

    // Add character count for message (optional enhancement)
    supportMessage.addEventListener('input', function() {
        const maxLength = 500;
        const currentLength = this.value.length;
        
        // Create or update character counter
        let counter = document.getElementById('messageCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'messageCounter';
            counter.style.cssText = `
                font-size: 0.8rem;
                color: var(--text-light);
                text-align: right;
                margin-top: 5px;
            `;
            this.parentNode.appendChild(counter);
        }
        
        counter.textContent = `${currentLength}/${maxLength} characters`;
        
        // Change color if approaching limit
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#E74C3C';
        } else if (currentLength > maxLength * 0.7) {
            counter.style.color = '#F39C12';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    });

    // Add recipe character count
    recipeInput.addEventListener('input', function() {
        const maxLength = 1000;
        const currentLength = this.value.length;
        
        let counter = document.getElementById('recipeCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'recipeCounter';
            counter.style.cssText = `
                font-size: 0.8rem;
                color: var(--text-light);
                text-align: right;
                margin-top: 5px;
            `;
            this.parentNode.appendChild(counter);
        }
        
        counter.textContent = `${currentLength}/${maxLength} characters`;
        
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#E74C3C';
        } else if (currentLength > maxLength * 0.7) {
            counter.style.color = '#F39C12';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    });

    // Handle drag and drop for photo upload
    const fileInputArea = photoUpload.parentElement;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileInputArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileInputArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileInputArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        fileInputArea.style.backgroundColor = '#E3F2FD';
        fileInputArea.style.borderColor = '#2196F3';
    }

    function unhighlight(e) {
        fileInputArea.style.backgroundColor = '';
        fileInputArea.style.borderColor = '';
    }

    fileInputArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            photoUpload.files = files;
            photoUpload.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter or Cmd+Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!outputSection.classList.contains('hidden')) {
                printBtn.click();
            } else if (uploadedPhotoSrc && supportMessage.value.trim()) {
                generateBtn.click();
            }
        }
        
        // Ctrl+P or Cmd+P for print (when output is visible)
        if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !outputSection.classList.contains('hidden')) {
            e.preventDefault();
            printBtn.click();
        }
    });

    // Add helpful tooltips
    generateBtn.title = 'Generate celebration card (Ctrl+Enter)';
    printBtn.title = 'Print celebration card (Ctrl+P)';
    
    // Initialize message counter
    supportMessage.dispatchEvent(new Event('input'));
});