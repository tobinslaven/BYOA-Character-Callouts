// Character-Callouts Website JavaScript

class CharacterCalloutsApp {
    constructor() {
        this.callouts = JSON.parse(localStorage.getItem('characterCallouts')) || [];
        this.filteredCallouts = null; // null means show all, string means filter by word
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadCallouts();
        this.generateWordCloud();
        this.setupFAQ();
        this.setupNavigation();
        this.setupToggle();
        this.currentView = 'popular'; // Default view
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('calloutForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Add category button
        const addCategoryBtn = document.getElementById('addCategory');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => this.addCategoryField());
        }

        // About section doesn't need form handling

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Clear filters when navigating to different sections
        document.querySelectorAll('a[href="#all-callouts"]').forEach(link => {
            link.addEventListener('click', () => {
                this.clearFilter();
                this.switchView('popular'); // Default to Most Loved
            });
        });

        document.querySelectorAll('a[href="#recent"]').forEach(link => {
            link.addEventListener('click', () => {
                this.clearFilter();
                this.switchView('recent');
            });
        });

        document.querySelectorAll('a[href="#popular"]').forEach(link => {
            link.addEventListener('click', () => {
                this.clearFilter();
                this.switchView('popular');
            });
        });
    }

    setupToggle() {
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.switchView(view);
            });
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view') === view) {
                btn.classList.add('active');
            }
        });
        
        // Refresh display
        this.displayCallouts();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const person = formData.get('person');
        const reason = formData.get('reason');
        const category1 = formData.get('category1');
        const category2 = formData.get('category2');
        const submitter = formData.get('submitter');

        if (!title || !person || !reason || !category1 || !submitter) {
            alert('Please fill in all required fields.');
            return;
        }

        const callout = {
            id: Date.now().toString(),
            title: title,
            person: person,
            reason: reason,
            categories: [category1],
            submitter: submitter,
            date: new Date().toISOString(),
            views: 0
        };

        if (category2 && category2.trim()) {
            callout.categories.push(category2);
        }

        this.callouts.unshift(callout);
        this.saveCallouts();
        this.loadCallouts();
        this.generateWordCloud();
        
        // Reset form
        e.target.reset();
        document.getElementById('and-text').style.display = 'none';
        
        // Show success message
        this.showNotification('Character-Callout submitted successfully!', 'success');
        
        // Scroll to all callouts section
        document.getElementById('all-callouts').scrollIntoView({ behavior: 'smooth' });
    }

    addCategoryField() {
        const categoriesInput = document.querySelector('.categories-input');
        const andText = document.getElementById('and-text');
        const category2Select = document.getElementById('category2');
        
        if (category2Select.style.display === 'none' || !category2Select.style.display) {
            category2Select.style.display = 'inline-block';
            andText.style.display = 'inline';
        } else {
            // Add more category fields dynamically
            const newCategoryDiv = document.createElement('div');
            newCategoryDiv.className = 'category-field';
            newCategoryDiv.innerHTML = `
                <span>and</span>
                <select name="category3">
                    <option value="">Choose another trait...</option>
                    <option value="Accepting">Accepting</option>
                    <option value="Adventurous">Adventurous</option>
                    <option value="Ambitious">Ambitious</option>
                    <option value="Articulate">Articulate</option>
                    <option value="Artistic">Artistic</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Brave">Brave</option>
                    <option value="Calm">Calm</option>
                    <option value="Caring">Caring</option>
                    <option value="Cheerful">Cheerful</option>
                    <option value="Committed">Committed</option>
                    <option value="Compassionate">Compassionate</option>
                    <option value="Confident">Confident</option>
                    <option value="Considerate">Considerate</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="Courageous">Courageous</option>
                    <option value="Creative">Creative</option>
                    <option value="Curious">Curious</option>
                    <option value="Dedicated">Dedicated</option>
                    <option value="Diligent">Diligent</option>
                    <option value="Driven">Driven</option>
                    <option value="Dynamic">Dynamic</option>
                    <option value="Eager">Eager</option>
                    <option value="Easy-going">Easy-going</option>
                    <option value="Efficient">Efficient</option>
                    <option value="Empathetic">Empathetic</option>
                    <option value="Encouraging">Encouraging</option>
                    <option value="Energetic">Energetic</option>
                    <option value="Enthusiastic">Enthusiastic</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Generous">Generous</option>
                    <option value="Gentle">Gentle</option>
                    <option value="Genuine">Genuine</option>
                    <option value="Helpful">Helpful</option>
                    <option value="Honest">Honest</option>
                    <option value="Humble">Humble</option>
                    <option value="Imaginative">Imaginative</option>
                    <option value="Inclusive">Inclusive</option>
                    <option value="Independent">Independent</option>
                    <option value="Innovative">Innovative</option>
                    <option value="Inquisitive">Inquisitive</option>
                    <option value="Insightful">Insightful</option>
                    <option value="Inspired">Inspired</option>
                    <option value="Integrity">Integrity</option>
                    <option value="Inventive">Inventive</option>
                    <option value="Joyful">Joyful</option>
                    <option value="Kind">Kind</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Loving">Loving</option>
                    <option value="Loyal">Loyal</option>
                    <option value="Motivated">Motivated</option>
                    <option value="Open-minded">Open-minded</option>
                    <option value="Optimistic">Optimistic</option>
                    <option value="Original">Original</option>
                    <option value="Patient">Patient</option>
                    <option value="Peaceful">Peaceful</option>
                    <option value="Perseverant">Perseverant</option>
                    <option value="Positive">Positive</option>
                    <option value="Proactive">Proactive</option>
                    <option value="Purposeful">Purposeful</option>
                    <option value="Receptive">Receptive</option>
                    <option value="Reflective">Reflective</option>
                    <option value="Resourceful">Resourceful</option>
                    <option value="Respectful">Respectful</option>
                    <option value="Responsible">Responsible</option>
                    <option value="Self-Assured">Self-Assured</option>
                    <option value="Self-Disciplined">Self-Disciplined</option>
                    <option value="Selfless">Selfless</option>
                    <option value="Self-Motivated">Self-Motivated</option>
                    <option value="Sensitive">Sensitive</option>
                    <option value="Sincere">Sincere</option>
                    <option value="Supportive">Supportive</option>
                    <option value="Thoughtful">Thoughtful</option>
                    <option value="Trustworthy">Trustworthy</option>
                    <option value="Wise">Wise</option>
                </select>
            `;
            categoriesInput.appendChild(newCategoryDiv);
        }
    }

    // Contact form handling removed - now using About page

    loadCallouts() {
        this.displayCallouts();
    }

    displayCallouts() {
        const grid = document.getElementById('calloutsGrid');
        if (!grid) return;

        let calloutsToShow;
        
        // Determine which callouts to show based on current view
        if (this.filteredCallouts) {
            calloutsToShow = this.getFilteredCallouts();
        } else {
            switch(this.currentView) {
                case 'recent':
                    calloutsToShow = [...this.callouts].sort((a, b) => 
                        new Date(b.date) - new Date(a.date)
                    );
                    break;
                case 'popular':
                    calloutsToShow = [...this.callouts].sort((a, b) => {
                        const aLikes = a.likes || 0;
                        const bLikes = b.likes || 0;
                        const aViews = a.views || 0;
                        const bViews = b.views || 0;
                        
                        // Sort by likes first, then by views as tiebreaker
                        if (aLikes !== bLikes) return bLikes - aLikes;
                        return bViews - aViews;
                    });
                    break;
                case 'all':
                default:
                    calloutsToShow = this.callouts;
            }
        }

        if (calloutsToShow.length === 0) {
            if (this.filteredCallouts) {
                grid.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; color: #666;">No Character-Callouts found with the word "${this.filteredCallouts}". <button onclick="app.clearFilter()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Show All</button></p>`;
            } else {
                grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #666;">No Character-Callouts yet. Be the first to submit one!</p>';
            }
            return;
        }

        // Add filter indicator if filtering
        let filterIndicator = '';
        if (this.filteredCallouts) {
            filterIndicator = `<div style="grid-column: 1 / -1; text-align: center; margin-bottom: 1rem; padding: 10px; background: #e3f2fd; border-radius: 8px; color: #1976d2;">
                <strong>Showing callouts with: "${this.filteredCallouts}"</strong>
                <button onclick="app.clearFilter()" style="background: #667eea; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Show All</button>
            </div>`;
        }

        grid.innerHTML = filterIndicator + calloutsToShow.map(callout => this.createCalloutCard(callout)).join('');
    }

    createCalloutCard(callout, isList = false) {
        const categoriesText = callout.categories.length > 1 
            ? callout.categories.join(' and ') 
            : callout.categories[0];

        const madlibsText = `I am giving a Character-Callout to ${callout.person} because ${callout.reason}`;
        const categoriesPhrase = `I call that ${categoriesText}`;

        const cardClass = isList ? 'callout-card list-card' : 'callout-card';
        const likes = callout.likes || 0;
        const isLiked = this.isCalloutLiked(callout.id);
        
        return `
            <div class="${cardClass}" onclick="app.incrementViews('${callout.id}')">
                <div class="callout-title">${this.escapeHtml(callout.title)}</div>
                <div class="callout-content">
                    <div class="callout-madlibs">${this.escapeHtml(madlibsText)}</div>
                    <div class="callout-categories">${this.escapeHtml(categoriesPhrase)}</div>
                </div>
                <div class="callout-meta">
                    <span class="callout-submitter">Submitted by ${this.escapeHtml(callout.submitter)}</span>
                    <span class="callout-date">${this.formatDate(callout.date)}</span>
                </div>
                <div class="callout-actions">
                    <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); app.toggleLike('${callout.id}')">
                        <i class="fas fa-heart"></i>
                        <span class="like-count">${likes}</span>
                    </button>
                </div>
            </div>
        `;
    }

    incrementViews(calloutId) {
        const callout = this.callouts.find(c => c.id === calloutId);
        if (callout) {
            callout.views = (callout.views || 0) + 1;
            this.saveCallouts();
        }
    }

    generateWordCloud() {
        const wordCloud = document.getElementById('wordCloud');
        if (!wordCloud) return;

        // Extract all categories and create word frequency
        const wordFreq = {};
        this.callouts.forEach(callout => {
            callout.categories.forEach(category => {
                const words = category.toLowerCase().split(/\s+/);
                words.forEach(word => {
                    if (word.length > 2) {
                        wordFreq[word] = (wordFreq[word] || 0) + 1;
                    }
                });
            });
        });

        // Sort by frequency and take top words
        const sortedWords = Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20)
            .map(([word, freq]) => ({ word, freq }));

        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

        if (sortedWords.length === 0) {
            // Default words with meaningful character traits
            const defaultWords = ['Kind', 'Caring', 'Helpful', 'Brave', 'Creative', 'Honest', 'Loyal', 'Generous', 'Patient', 'Respectful'];
            // Use grid-based distribution for default words too
            const gridCols = 3;
            const gridRows = Math.ceil(defaultWords.length / gridCols);
            const cellWidth = 80 / gridCols; // 80% of container width (leaving margin)
            const cellHeight = 80 / gridRows; // 80% of container height (leaving margin)
            
            wordCloud.innerHTML = defaultWords.map((word, index) => {
                const size = Math.random() * 0.4 + 1.0; // Random size between 1.0 and 1.4
                
                // Calculate grid position
                const col = index % gridCols;
                const row = Math.floor(index / gridCols);
                
                // Base position from grid with more margin
                const baseX = 10 + (col * cellWidth);
                const baseY = 10 + (row * cellHeight);
                
                // Add randomness within the grid cell (smaller range to avoid edges)
                const randomX = Math.random() * (cellWidth * 0.5) + (cellWidth * 0.25);
                const randomY = Math.random() * (cellHeight * 0.5) + (cellHeight * 0.25);
                
                const x = baseX + randomX;
                const y = baseY + randomY;
                
                const rotation = (Math.random() - 0.5) * 15; // Random rotation -7 to +7 degrees
                const color = colors[index % colors.length];
                return `<span style="font-size: ${size}em; left: ${x}%; top: ${y}%; transform: rotate(${rotation}deg); color: ${color}; z-index: ${index};" onclick="app.filterByWord('${word}')" title="Click to see callouts with '${word}'">${word}</span>`;
            }).join('');
            return;
        }

        const maxFreq = Math.max(...sortedWords.map(w => w.freq));

        // Create better word distribution using grid-based positioning with randomness
        const gridCols = 4;
        const gridRows = Math.ceil(sortedWords.length / gridCols);
        const cellWidth = 80 / gridCols; // 80% of container width divided by columns (leaving margin)
        const cellHeight = 80 / gridRows; // 80% of container height divided by rows (leaving margin)
        
        wordCloud.innerHTML = sortedWords.map(({ word, freq }, index) => {
            const size = Math.max(0.8, Math.min(2.0, (freq / maxFreq) * 2.0));
            
            // Calculate grid position
            const col = index % gridCols;
            const row = Math.floor(index / gridCols);
            
            // Base position from grid with more margin
            const baseX = 10 + (col * cellWidth);
            const baseY = 10 + (row * cellHeight);
            
            // Add randomness within the grid cell (smaller range to avoid edges)
            const randomX = Math.random() * (cellWidth * 0.5) + (cellWidth * 0.25);
            const randomY = Math.random() * (cellHeight * 0.5) + (cellHeight * 0.25);
            
            const x = baseX + randomX;
            const y = baseY + randomY;
            
            const rotation = (Math.random() - 0.5) * 15; // Random rotation -7 to +7 degrees
            const color = colors[index % colors.length];
            
            return `<span style="font-size: ${size}em; left: ${x}%; top: ${y}%; transform: rotate(${rotation}deg); color: ${color}; z-index: ${index};" onclick="app.filterByWord('${word}')" title="Click to see callouts with '${word}' (used ${freq} times)">${word}</span>`;
        }).join('');
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        });
    }

    saveCallouts() {
        localStorage.setItem('characterCallouts', JSON.stringify(this.callouts));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    filterByWord(word) {
        this.filteredCallouts = word;
        this.displayCallouts();
        
        // Scroll to the callouts section
        document.getElementById('all-callouts').scrollIntoView({ behavior: 'smooth' });
        
        // Show notification
        this.showNotification(`Showing callouts with the word "${word}"`, 'info');
    }

    getFilteredCallouts() {
        if (!this.filteredCallouts) return this.callouts;
        
        return this.callouts.filter(callout => {
            return callout.categories.some(category => 
                category.toLowerCase().includes(this.filteredCallouts.toLowerCase())
            );
        });
    }

    clearFilter() {
        this.filteredCallouts = null;
        this.displayCallouts();
        this.showNotification('Showing all callouts', 'info');
    }

    toggleLike(calloutId) {
        const callout = this.callouts.find(c => c.id === calloutId);
        if (!callout) return;

        // Initialize likes if not present
        if (!callout.likes) callout.likes = 0;

        // Toggle like status
        const likedCallouts = JSON.parse(localStorage.getItem('likedCallouts') || '[]');
        const isLiked = likedCallouts.includes(calloutId);

        if (isLiked) {
            // Unlike
            callout.likes = Math.max(0, callout.likes - 1);
            const index = likedCallouts.indexOf(calloutId);
            likedCallouts.splice(index, 1);
            this.showNotification('Removed heart', 'info');
        } else {
            // Like
            callout.likes += 1;
            likedCallouts.push(calloutId);
            this.showNotification('Loved this callout! ❤️', 'success');
        }

        // Save to localStorage
        localStorage.setItem('likedCallouts', JSON.stringify(likedCallouts));
        localStorage.setItem('characterCallouts', JSON.stringify(this.callouts));

        // Update display
        this.displayCallouts();
    }

    isCalloutLiked(calloutId) {
        const likedCallouts = JSON.parse(localStorage.getItem('likedCallouts') || '[]');
        return likedCallouts.includes(calloutId);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CharacterCalloutsApp();
});

// Add some sample data for demonstration
if (localStorage.getItem('characterCallouts') === null) {
    const sampleCallouts = [
        {
            id: '1',
            title: 'My Amazing Sister Sarah',
            person: 'Sarah',
            reason: 'she always knows how to make me laugh when I\'m feeling down',
            categories: ['Caring', 'Cheerful'],
            submitter: 'Emma Johnson',
            date: new Date(Date.now() - 86400000).toISOString(),
            views: 15
        },
        {
            id: '2',
            title: 'The Best Guide Ever',
            person: 'Mr. Rodriguez',
            reason: 'he made math fun and helped me understand concepts I never thought I could',
            categories: ['Patient', 'Encouraging'],
            submitter: 'Alex Chen',
            date: new Date(Date.now() - 172800000).toISOString(),
            views: 23
        },
        {
            id: '3',
            title: 'My Incredible Mom',
            person: 'Mom',
            reason: 'she works two jobs and still finds time to help me with my homework every night',
            categories: ['Dedicated', 'Loving'],
            submitter: 'David Kim',
            date: new Date(Date.now() - 259200000).toISOString(),
            views: 31
        },
        {
            id: '4',
            title: 'My Brave Friend Jake',
            person: 'Jake',
            reason: 'he stood up for a kid who was being bullied at lunch',
            categories: ['Brave', 'Courage'],
            submitter: 'Maya Patel',
            date: new Date(Date.now() - 345600000).toISOString(),
            views: 18
        },
        {
            id: '5',
            title: 'My Creative Art Guide',
            person: 'Ms. Williams',
            reason: 'she helped me discover my love for painting and never gave up on me',
            categories: ['Creative', 'Supportive'],
            submitter: 'Jordan Smith',
            date: new Date(Date.now() - 432000000).toISOString(),
            views: 27
        }
    ];
    localStorage.setItem('characterCallouts', JSON.stringify(sampleCallouts));
}
