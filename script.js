document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.querySelector('.job-listings-container');
    const filterBarContainer = document.querySelector('.filter-bar-container');
    const activeFiltersDisplay = document.querySelector('.active-filters');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');

    let allJobs = []; // This will now directly hold the hardcoded data
    let activeFilters = new Set(); // Using a Set for better performance

    // --- Hardcoded JSON data from your data.json ---
    // This directly embeds the data, avoiding the 'fetch' operation and potential HTTP errors
    // when running files directly from the file system.
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

    allJobs = initialJobData; // Assign the hardcoded data to allJobs
    
    // Initial filters as per "active-states.jpg"
    // These calls will trigger the display of jobs as they add filters and call applyFilters()
    addFilter('Frontend');
    addFilter('CSS');
    addFilter('JavaScript');

    // --- Function to create a single job card HTML ---
    function createJobCard(job) {
        const card = document.createElement('div');
        card.classList.add('job-card');
        if (job.featured) {
            card.classList.add('featured');
        }

        let badgesHTML = '';
        if (job.new) {
            badgesHTML += '<span class="new-badge">NEW!</span>';
        }
        if (job.featured) {
            badgesHTML += '<span class="featured-badge">FEATUREED</span>';
        }

        // Combine all relevant tags for the job into a single array
        const allTags = [job.role, job.level, ...job.languages, ...job.tools];
        let tagsHTML = '';
        allTags.forEach(tag => {
            if (tag) {
                // Attach data-filter attribute to the tag for filtering
                tagsHTML += `<span class="filter-tag" data-filter="${tag}">${tag}</span>`;
            }
        });

        card.innerHTML = `
            <img src="${job.logo}" alt="${job.company} logo">
            <div class="job-info">
                <div class="company-new-featured">
                    <span class="company-name">${job.company}</span>
                    ${badgesHTML}
                </div>
                <h2 class="position">${job.position}</h2>
                <div class="details">
                    <span>${job.postedAt}</span>
                    <span>${job.contract}</span>
                    <span>${job.location}</span>
                </div>
            </div>
            <div class="filters-container">
                ${tagsHTML}
            </div>
        `;
        return card;
    }

    // --- Function to display jobs based on filters ---
    function displayJobs(jobsToDisplay) {
        jobListingsContainer.innerHTML = ''; // Clear previous listings
        if (jobsToDisplay.length === 0 && activeFilters.size > 0) {
            jobListingsContainer.innerHTML = '<p style="text-align: center; color: var(--dark-grayish-cyan);">No job listings match your current filters.</p>';
        } else if (jobsToDisplay.length === 0 && activeFilters.size === 0) {
             jobListingsContainer.innerHTML = '<p style="text-align: center; color: var(--dark-grayish-cyan);">No job listings available.</p>';
        } else {
            jobsToDisplay.forEach(job => {
                const jobCard = createJobCard(job);
                jobListingsContainer.appendChild(jobCard);
            });
        }

        // Add event listeners to newly created filter tags on job cards
        document.querySelectorAll('.job-card .filter-tag').forEach(tag => {
            tag.addEventListener('click', (event) => {
                const filter = event.target.dataset.filter;
                addFilter(filter);
            });
        });
    }

    // --- Function to add a filter to activeFilters and update UI ---
    function addFilter(filter) {
        if (!activeFilters.has(filter)) { // Use has() for Set
            activeFilters.add(filter); // Use add() for Set
            updateFilterBarUI(); // Update filter bar
            applyFilters();      // Apply filters to job listings
        }
    }

    // --- Function to remove a filter from activeFilters and update UI ---
    function removeFilter(filterToRemove) {
        activeFilters.delete(filterToRemove); // Use delete() for Set
        updateFilterBarUI(); // Update filter bar
        applyFilters();      // Apply filters to job listings
    }

    // --- Function to clear all filters ---
    function clearAllFilters() {
        activeFilters.clear(); // Use clear() for Set
        updateFilterBarUI(); // Update filter bar (should hide it if no filters)
        applyFilters();      // Apply filters (should show all jobs)
    }

    // --- Function to update the filter bar UI ---
    function updateFilterBarUI() {
        activeFiltersDisplay.innerHTML = ''; // Clear current filter tags
        if (activeFilters.size > 0) { // Use size for Set
            filterBarContainer.classList.add('show'); // Show the filter bar with animation
            activeFilters.forEach(filter => {
                const filterTagItem = document.createElement('div');
                filterTagItem.classList.add('filter-tag-item');
                filterTagItem.innerHTML = `
                    <span>${filter}</span>
                    <button class="remove-filter-btn" data-filter="${filter}">X</button>
                `;
                activeFiltersDisplay.appendChild(filterTagItem);
            });

            // Attach event listeners to the new 'X' buttons in the filter bar
            document.querySelectorAll('.filter-tag-item .remove-filter-btn').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const filterToRemove = event.target.dataset.filter;
                    removeFilter(filterToRemove);
                });
            });
        } else {
            filterBarContainer.classList.remove('show'); // Hide the filter bar
        }
    }

    // --- Function to apply filters to the job data ---
    function applyFilters() {
        if (activeFilters.size === 0) { // Use size for Set
            displayJobs(allJobs); // Show all jobs if no filters
            return;
        }

        const filteredJobs = allJobs.filter(job => {
            // Combine all relevant tags for the job into a single array and convert to lowercase for case-insensitive matching
            const jobTags = [job.role, job.level, ...job.languages, ...job.tools].map(tag => tag ? tag.toLowerCase() : '');

            // Check if ALL active filters are present in the job's tags
            return Array.from(activeFilters).every(filter => jobTags.includes(filter.toLowerCase())); // Convert Set to Array for every()
        });
        displayJobs(filteredJobs);
    }

    // Event listener for the "Clear" button
    clearFiltersBtn.addEventListener('click', clearAllFilters);

    // Initial setup when the DOM is ready (jobs are displayed via initial filters)
    // The previous call to fetchData() is removed. Filters are added directly.
    // applyFilters() is called last to display jobs with the initial filters.
});