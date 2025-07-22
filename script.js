// Activities Journal App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get all the DOM elements
    const photoUpload = document.getElementById('photoUpload');
    const photoPreview = document.getElementById('photoPreview');
    const previewImg = document.getElementById('previewImg');
    const supportMessage = document.getElementById('supportMessage');
    const includeDocuments = document.getElementById('includeDocuments');
    const documentsSection = document.getElementById('documentsSection');
    const activityDetails = document.getElementById('activityDetails');
    const documentUpload = document.getElementById('documentUpload');
    const documentPreview = document.getElementById('documentPreview');
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const outputSection = document.getElementById('output');
    const outputPhoto = document.getElementById('outputPhoto');
    const outputMessage = document.getElementById('outputMessage');
    const documentsDisplay = document.getElementById('documentsDisplay');
    const outputActivityDetails = document.getElementById('outputActivityDetails');
    const outputDocuments = document.getElementById('outputDocuments');
    const currentDate = document.getElementById('currentDate');
    const includeBibleVerse = document.getElementById('includeBibleVerse');
    const bibleVerseDisplay = document.getElementById('bibleVerseDisplay');
    const verseContent = document.getElementById('verseContent');
    const verseReference = document.getElementById('verseReference');
    const regenerateVerse = document.getElementById('regenerateVerse');
    const quoteText = document.getElementById('quoteText');
    const quoteAttribution = document.getElementById('quoteAttribution');

    let uploadedPhotoSrc = '';
    let currentBibleVerse = null;
    let currentStaffQuote = null;

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

    // Handle documents checkbox toggle
    includeDocuments.addEventListener('change', function() {
        if (this.checked) {
            documentsSection.classList.remove('hidden');
            // Add smooth slide-down effect
            documentsSection.style.opacity = '0';
            documentsSection.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                documentsSection.style.transition = 'all 0.3s ease';
                documentsSection.style.opacity = '1';
                documentsSection.style.transform = 'translateY(0)';
            }, 10);
        } else {
            documentsSection.classList.add('hidden');
            activityDetails.value = ''; // Clear activity details when hidden
            documentUpload.value = ''; // Clear document upload when hidden
            uploadedDocuments = [];
            documentPreview.classList.add('hidden');
        }
    });

    // Load inspirational quote in header on page load
    async function loadHeaderQuote() {
        try {
            const quote = await fetchInspirationalQuote();
            if (quote) {
                quoteText.textContent = `"${quote.text}"`;
                quoteAttribution.textContent = `— ${quote.author}`;
            }
        } catch (error) {
            console.error('Error loading header quote:', error);
            // Keep default text if quote fails to load
        }
    }

    let uploadedDocuments = [];

    // Handle document upload and preview
    documentUpload.addEventListener('change', function(event) {
        const files = Array.from(event.target.files);
        uploadedDocuments = [];
        documentPreview.innerHTML = '';
        
        if (files.length > 0) {
            files.forEach((file, index) => {
                // Check file size (limit to 10MB per file)
                if (file.size > 10 * 1024 * 1024) {
                    alert(`File "${file.name}" is too large. Please select files smaller than 10MB.`);
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    const docData = {
                        name: file.name,
                        type: file.type,
                        data: e.target.result
                    };
                    uploadedDocuments.push(docData);
                    
                    // Create preview element
                    const previewItem = document.createElement('div');
                    previewItem.className = 'document-item';
                    previewItem.innerHTML = `
                        <span class="doc-icon">${getFileIcon(file.type)}</span>
                        <span class="doc-name">${file.name}</span>
                        <span class="doc-size">(${formatFileSize(file.size)})</span>
                    `;
                    documentPreview.appendChild(previewItem);
                    
                    if (index === 0) {
                        documentPreview.classList.remove('hidden');
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            documentPreview.classList.add('hidden');
        }
    });

    function getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('doc')) return '📝';
        if (fileType.includes('text')) return '📃';
        return '📎';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Function to fetch inspirational quotes for staff
    async function fetchInspirationalQuote() {
        try {
            // Use our Netlify function to get quotes (avoids CORS issues)
            const response = await fetch('/.netlify/functions/get-quote', {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.quote && data.quote.text && data.quote.author) {
                    return {
                        text: data.quote.text,
                        author: data.quote.author
                    };
                }
            }
            
            console.log('Quote function unavailable, using client fallback');
            
        } catch (error) {
            console.log('Error fetching from quote function, using client fallback:', error.message);
        }

        // Client-side fallback quotes if function fails
        const clientFallbackQuotes = [
            { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
            { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
            { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
            { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
            { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
            { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" }
        ];

        // Use client fallback quote
        const randomFallback = clientFallbackQuotes[Math.floor(Math.random() * clientFallbackQuotes.length)];
        return randomFallback;
    }

    // Function to fetch random Bible verse
    async function fetchRandomBibleVerse() {
        // Expanded array of encouraging and uplifting verses for fallback
        const fallbackVerses = [
            { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
            { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.", reference: "Jeremiah 29:11" },
            { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5-6" },
            { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
            { text: "And we know that in all things God works for the good of those who love him.", reference: "Romans 8:28" },
            { text: "Give thanks to the Lord, for he is good; his love endures forever.", reference: "Psalm 107:1" },
            { text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.", reference: "Zephaniah 3:17" },
            { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" },
            { text: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.", reference: "Numbers 6:24-25" },
            { text: "You are precious and honored in my sight, and I love you.", reference: "Isaiah 43:4" },
            { text: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28" },
            { text: "Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid.", reference: "John 14:27" },
            { text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.", reference: "Psalm 23:1-3" },
            { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.", reference: "Isaiah 40:31" },
            { text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", reference: "1 Corinthians 13:4" },
            { text: "Every good and perfect gift is from above, coming down from the Father of the heavenly lights.", reference: "James 1:17" },
            { text: "This is the day the Lord has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" },
            { text: "May the God of hope fill you with all joy and peace as you trust in him.", reference: "Romans 15:13" },
            { text: "The fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.", reference: "Galatians 5:22-23" },
            { text: "And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work.", reference: "2 Corinthians 9:8" }
        ];

        try {
            // Focus on encouraging books and use specific encouraging verses
            const encouragingVerses = [
                'psalms+23:1',   // The Lord is my shepherd
                'psalms+46:1',   // God is our refuge and strength
                'psalms+139:14', // I praise you because I am fearfully and wonderfully made
                'philippians+4:13', // I can do all things through Christ
                'jeremiah+29:11',   // Plans to prosper you
                'romans+8:28',      // All things work together for good
                'isaiah+40:31',     // Renew their strength
                'john+14:27',       // Peace I leave with you
                '1peter+5:7',       // Cast all anxiety on him
                'matthew+11:28',    // Come to me all who are weary
                'proverbs+3:5',     // Trust in the Lord
                '2corinthians+12:9' // My grace is sufficient
            ];
            
            const randomVerse = encouragingVerses[Math.floor(Math.random() * encouragingVerses.length)];
            
            const response = await fetch(`https://bible-api.com/${randomVerse}`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.text && data.reference) {
                    // Filter out potentially harsh language
                    const verseText = data.text.replace(/[\r\n]+/g, ' ').trim();
                    const harshWords = ['wrath', 'anger', 'destroy', 'punish', 'judgment', 'condemn', 'curse', 'vengeance'];
                    
                    // Check if verse contains harsh words
                    const containsHarshWords = harshWords.some(word => 
                        verseText.toLowerCase().includes(word)
                    );
                    
                    if (!containsHarshWords) {
                        return {
                            text: verseText,
                            reference: data.reference
                        };
                    } else {
                        console.log('API verse contains harsh language, using fallback');
                    }
                }
            }
            
        } catch (error) {
            console.log('Bible API unavailable, using fallback verse:', error.message);
        }

        // Use fallback verse if API fails or returns harsh content
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

        // Save to database and generate the celebration card
        await saveCelebrationToDatabase();
        generateCelebration();
    });

    // Handle print functionality
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // Handle Bible verse regeneration
    regenerateVerse.addEventListener('click', async function() {
        try {
            regenerateVerse.disabled = true;
            regenerateVerse.textContent = '🔄 Loading...';
            
            // Fetch a new Bible verse
            const newVerse = await fetchRandomBibleVerse();
            
            if (newVerse) {
                currentBibleVerse = newVerse;
                verseContent.textContent = `"${newVerse.text}"`;
                verseReference.textContent = `- ${newVerse.reference}`;
                
                // Add a subtle animation to show the verse changed
                bibleVerseDisplay.style.transition = 'opacity 0.3s ease';
                bibleVerseDisplay.style.opacity = '0.7';
                setTimeout(() => {
                    bibleVerseDisplay.style.opacity = '1';
                }, 150);
            }
        } catch (error) {
            console.error('Error regenerating Bible verse:', error);
        } finally {
            regenerateVerse.disabled = false;
            regenerateVerse.textContent = '🔄 New Verse';
        }
    });

    // Generate celebration card function
    function generateCelebration() {
        // Set the photo
        outputPhoto.src = uploadedPhotoSrc;
        
        // Set the message
        outputMessage.textContent = supportMessage.value.trim();
        
        // Handle documents and activity details display
        if (includeDocuments.checked && (activityDetails.value.trim() || uploadedDocuments.length > 0)) {
            // Display activity details text
            if (activityDetails.value.trim()) {
                outputActivityDetails.textContent = activityDetails.value.trim();
            } else {
                outputActivityDetails.textContent = '';
            }
            
            // Display uploaded documents
            outputDocuments.innerHTML = '';
            if (uploadedDocuments.length > 0) {
                const docsHeader = document.createElement('h4');
                docsHeader.textContent = 'Memory Documents:';
                outputDocuments.appendChild(docsHeader);
                
                uploadedDocuments.forEach(doc => {
                    const docItem = document.createElement('div');
                    docItem.className = 'output-document-item';
                    
                    if (doc.type.startsWith('image/')) {
                        // Show image preview
                        const img = document.createElement('img');
                        img.src = doc.data;
                        img.alt = doc.name;
                        img.style.maxWidth = '200px';
                        img.style.maxHeight = '150px';
                        img.style.borderRadius = '8px';
                        img.style.marginBottom = '10px';
                        docItem.appendChild(img);
                    } else {
                        // Show file icon and name
                        const fileInfo = document.createElement('div');
                        fileInfo.innerHTML = `
                            <span style="font-size: 24px; margin-right: 10px;">${getFileIcon(doc.type)}</span>
                            <span>${doc.name}</span>
                        `;
                        docItem.appendChild(fileInfo);
                    }
                    
                    outputDocuments.appendChild(docItem);
                });
            }
            
            documentsDisplay.classList.remove('hidden');
        } else {
            documentsDisplay.classList.add('hidden');
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

    // Add activity details character count
    activityDetails.addEventListener('input', function() {
        const maxLength = 2000;
        const currentLength = this.value.length;
        
        let counter = document.getElementById('activityDetailsCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'activityDetailsCounter';
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
    
    // Database Integration Functions
    async function saveCelebrationToDatabase() {
        try {
            generateBtn.textContent = 'Saving...';
            generateBtn.disabled = true;
            
            const celebrationData = {
                clientName: null, // Can be extended later
                supportiveMessage: supportMessage.value.trim(),
                activityDetails: (includeDocuments.checked && activityDetails.value.trim()) ? activityDetails.value.trim() : null,
                documents: (includeDocuments.checked && uploadedDocuments.length > 0) ? JSON.stringify(uploadedDocuments) : null,
                bibleVerse: (includeBibleVerse.checked && currentBibleVerse) ? currentBibleVerse.text : null,
                bibleReference: (includeBibleVerse.checked && currentBibleVerse) ? currentBibleVerse.reference : null,
                photoUrl: uploadedPhotoSrc, // This is the base64 data URL for now
                createdBy: null // Can be extended later for multi-user support
            };

            const response = await fetch('/.netlify/functions/save-celebration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(celebrationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save celebration');
            }

            const result = await response.json();
            console.log('Celebration saved successfully:', result);
            
            // Show success feedback
            const originalText = generateBtn.textContent;
            generateBtn.textContent = 'Saved!';
            setTimeout(() => {
                generateBtn.textContent = originalText;
            }, 2000);
            
        } catch (error) {
            console.error('Error saving celebration:', error);
            
            // Show more detailed error message
            let errorMessage = 'Could not save to database, but you can still print your celebration.';
            
            if (error.message.includes('Failed to save celebration')) {
                errorMessage = 'Database connection issue. Your celebration wasn\'t saved, but you can still print it.';
            } else if (error.message.includes('Database not configured')) {
                errorMessage = 'Database is being set up. Your celebration wasn\'t saved, but you can still print it.';
            }
            
            // Create a more user-friendly notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f39c12;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 1000;
                max-width: 300px;
                font-size: 14px;
            `;
            notification.textContent = errorMessage;
            document.body.appendChild(notification);
            
            // Remove notification after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 5000);
        } finally {
            generateBtn.textContent = 'Generate Celebration';
            generateBtn.disabled = false;
        }
    }

    async function loadRecentCelebrations() {
        try {
            const response = await fetch('/.netlify/functions/get-celebrations');
            
            if (!response.ok) {
                throw new Error('Failed to load celebrations');
            }

            const result = await response.json();
            return result.celebrations || [];
        } catch (error) {
            console.error('Error loading celebrations:', error);
            return [];
        }
    }

    // Optional: Add a button to view recent celebrations (can be implemented later)
    function createHistoryButton() {
        const historyBtn = document.createElement('button');
        historyBtn.textContent = 'View Recent Celebrations';
        historyBtn.className = 'btn btn-secondary';
        historyBtn.style.display = 'none'; // Hidden for now, can be enabled later
        historyBtn.onclick = async () => {
            const celebrations = await loadRecentCelebrations();
            console.log('Recent celebrations:', celebrations);
            // Could implement a modal or new page to display these
        };
        return historyBtn;
    }

    // Initialize message counter
    supportMessage.dispatchEvent(new Event('input'));
    
    // Load inspirational quote in header
    loadHeaderQuote();
});