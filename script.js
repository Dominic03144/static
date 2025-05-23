document.addEventListener('DOMContentLoaded', () => {
    const jobItemsWrapper = document.querySelector('.job-items-wrapper');
    const criteriaSelectionPanel = document.querySelector('.criteria-selection-panel');
    const currentSelections = document.querySelector('.current-selections');
    const resetCriteriaButton = document.querySelector('.reset-criteria-button');

    let allJobs = []; 
    let activeFilters = new Set(); 

    const initialJobData = [
        {
            "id": 1,
            "company": "Photosnap",
            "logo": "./images/photosnap.svg",
            "new": true,
            "featured": true,
            "position": "Senior Frontend Developer",
            "role": "Frontend",
            "level": "Senior",
            "postedAt": "1d ago",
            "contract": "Full Time",
            "location": "USA Only",
            "languages": ["HTML", "CSS", "JavaScript"],
            "tools": []
        },
        {
            "id": 2,
            "company": "Manage",
            "logo": "./images/manage.svg",
            "new": true,
            "featured": true,
            "position": "Fullstack Developer",
            "role": "Fullstack",
            "level": "Midweight",
            "postedAt": "1d ago",
            "contract": "Part Time",
            "location": "Remote",
            "languages": ["Python"],
            "tools": ["React"]
        },
        {
            "id": 3,
            "company": "Account",
            "logo": "./images/account.svg",
            "new": true,
            "featured": false,
            "position": "Junior Frontend Developer",
            "role": "Frontend",
            "level": "Junior",
            "postedAt": "2d ago",
            "contract": "Part Time",
            "location": "USA Only",
            "languages": ["JavaScript"],
            "tools": ["React", "Sass"]
        },
        {
            "id": 4,
            "company": "MyHome",
            "logo": "./images/myhome.svg",
            "new": false,
            "featured": false,
            "position": "Junior Frontend Developer",
            "role": "Frontend",
            "level": "Junior",
            "postedAt": "5d ago",
            "contract": "Contract",
            "location": "USA Only",
            "languages": ["CSS", "JavaScript"],
            "tools": []
        },
        {
            "id": 5,
            "company": "Loop Studios",
            "logo": "./images/loop-studios.svg",
            "new": false,
            "featured": false,
            "position": "Software Engineer",
            "role": "Fullstack",
            "level": "Midweight",
            "postedAt": "1w ago",
            "contract": "Full Time",
            "location": "Worldwide",
            "languages": ["JavaScript", "Ruby"],
            "tools": ["Sass"]
        },
        {
            "id": 6,
            "company": "FaceIt",
            "logo": "./images/faceit.svg",
            "new": false,
            "featured": false,
            "position": "Junior Backend Developer",
            "role": "Backend",
            "level": "Junior",
            "postedAt": "2w ago",
            "contract": "Full Time",
            "location": "UK Only",
            "languages": ["Ruby"],
            "tools": ["RoR"]
        },
        {
            "id": 7,
            "company": "Shortly",
            "logo": "./images/shortly.svg",
            "new": false,
            "featured": false,
            "position": "Junior Developer",
            "role": "Frontend",
            "level": "Junior",
            "postedAt": "2w ago",
            "contract": "Full Time",
            "location": "Worldwide",
            "languages": ["HTML", "JavaScript"],
            "tools": ["Sass"]
        },
        {
            "id": 8,
            "company": "Insure",
            "logo": "./images/insure.svg",
            "new": false,
            "featured": false,
            "position": "Junior Frontend Developer",
            "role": "Frontend",
            "level": "Junior",
            "postedAt": "2w ago",
            "contract": "Full Time",
            "location": "USA Only",
            "languages": ["JavaScript"],
            "tools": ["Vue", "Sass"]
        },
        {
            "id": 9,
            "company": "Eyecam Co.",
            "logo": "./images/eyecam-co.svg",
            "new": false,
            "featured": false,
            "position": "Full Stack Engineer",
            "role": "Fullstack",
            "level": "Midweight",
            "postedAt": "3w ago",
            "contract": "Full Time",
            "location": "Worldwide",
            "languages": ["JavaScript", "Python"],
            "tools": ["Django"]
        },
        {
            "id": 10,
            "company": "The Air Filter Company",
            "logo": "./images/the-air-filter-company.svg",
            "new": false,
            "featured": false,
            "position": "Front-end Dev",
            "role": "Frontend",
            "level": "Junior",
            "postedAt": "1mo ago",
            "contract": "Part Time",
            "location": "Worldwide",
            "languages": ["JavaScript"],
            "tools": ["React", "Sass"]
        }
    ];

    allJobs = initialJobData; 
    
    addFilter('Frontend');
    addFilter('CSS');
    addFilter('JavaScript');

    function createListingBlock(job) {
        const block = document.createElement('div');
        block.classList.add('listing-block');
        if (job.featured) {
            block.classList.add('highlighted');
        }

        let badgesHTML = '';
        if (job.new) {
            badgesHTML += '<span class="fresh-indicator">NEW!</span>';
        }
        if (job.featured) {
            badgesHTML += '<span class="premium-tag">FEATURED</span>';
        }

        const allTags = [job.role, job.level, ...job.languages, ...job.tools];
        let tagsHTML = '';
        allTags.forEach(tag => {
            if (tag) {
                tagsHTML += `<span class="selection-tag" data-filter="${tag}">${tag}</span>`;
            }
        });

        block.innerHTML = `
            <img src="${job.logo}" alt="${job.company} logo">
            <div class="listing-details">
                <div class="org-status-section">
                    <span class="org-title">${job.company}</span>
                    ${badgesHTML}
                </div>
                <h2 class="role-designation">${job.position}</h2>
                <div class="timing-location-info">
                    <span>${job.postedAt}</span>
                    <span>${job.contract}</span>
                    <span>${job.location}</span>
                </div>
            </div>
            <div class="skill-tags-group">
                ${tagsHTML}
            </div>
        `;
        return block;
    }

    function displayListings(listingsToDisplay) {
        jobItemsWrapper.innerHTML = ''; 
        if (listingsToDisplay.length === 0 && activeFilters.size > 0) {
            jobItemsWrapper.innerHTML = '<p style="text-align: center; color: var(--deep-teal);">No job listings match your current criteria.</p>';
        } else if (listingsToDisplay.length === 0 && activeFilters.size === 0) {
             jobItemsWrapper.innerHTML = '<p style="text-align: center; color: var(--deep-teal);">No job listings available.</p>';
        } else {
            listingsToDisplay.forEach(job => {
                const listingBlock = createListingBlock(job);
                jobItemsWrapper.appendChild(listingBlock);
            });
        }

        document.querySelectorAll('.listing-block .selection-tag').forEach(tag => {
            tag.addEventListener('click', (event) => {
                const filter = event.target.dataset.filter;
                addFilter(filter);
            });
        });
    }

    function addFilter(filter) {
        if (!activeFilters.has(filter)) { 
            activeFilters.add(filter); 
            updateCriteriaPanelUI(); 
            applyFilters();      
        }
    }

    function removeFilter(filterToRemove) {
        activeFilters.delete(filterToRemove); 
        updateCriteriaPanelUI(); 
        applyFilters();      
    }

    function clearAllFilters() {
        activeFilters.clear(); 
        updateCriteriaPanelUI(); 
        applyFilters();      
    }

    function updateCriteriaPanelUI() {
        currentSelections.innerHTML = ''; 
        if (activeFilters.size > 0) { 
            criteriaSelectionPanel.classList.add('visible'); 
            activeFilters.forEach(filter => {
                const selectedCriteriaItem = document.createElement('div');
                selectedCriteriaItem.classList.add('selected-criteria-item');
                selectedCriteriaItem.innerHTML = `
                    <span>${filter}</span>
                    <button class="remove-selection-button" data-filter="${filter}">X</button>
                `;
                currentSelections.appendChild(selectedCriteriaItem);
            });

            document.querySelectorAll('.selected-criteria-item .remove-selection-button').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const filterToRemove = event.target.dataset.filter;
                    removeFilter(filterToRemove);
                });
            });
        } else {
            criteriaSelectionPanel.classList.remove('visible'); 
        }
    }

    function applyFilters() {
        if (activeFilters.size === 0) { 
            displayListings(allJobs); 
            return;
        }

        const filteredJobs = allJobs.filter(job => {
            const jobTags = [job.role, job.level, ...job.languages, ...job.tools].map(tag => tag ? tag.toLowerCase() : '');

            return Array.from(activeFilters).every(filter => jobTags.includes(filter.toLowerCase())); 
        });
        displayListings(filteredJobs);
    }

    resetCriteriaButton.addEventListener('click', clearAllFilters);
});