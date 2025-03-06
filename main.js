import { portfolioData, glitchFrames, defaultDarkMode } from './config.js';

const loadingText = document.getElementById("loading");
const terminal = document.getElementById("terminal");
const terminalInput = document.getElementById("terminal-input");
const commandHistory = document.getElementById("command-history");
const themeToggle = document.getElementById("theme-toggle");
const moonIcon = document.querySelector(".moon");
const sunIcon = document.querySelector(".sun");
const terminalContent = document.querySelector(".terminal-content");

let index = 0;
let darkMode = defaultDarkMode;

// command history navigation
let commandsHistory = [];
let historyIndex = -1;

const usedCommands = new Set();
let unusedCommandsElement;
let hamburgerMenu;

const commands = {
   help: function() {
       markCommandAsUsed('help');
       return `
Available commands:
- about:        Display information about me
- skills:       List my technical skills
- interests:    Show my interests
- projects:     View my projects
- blog:         Read my latest blog posts
- contact:      Get my contact information
- experience:   View my education and certifications
- clear:        Clear the terminal
- theme:        Toggle light/dark mode
- help:         Show this help message
`;
   },
  
   about: function() {
       markCommandAsUsed('about');
       return portfolioData.about;
   },
  
   skills: function() {
       markCommandAsUsed('skills');
       let output = `<div class="skills-container">
<h2>My Skills - Rated by Oscar Awards 🏆</h2>
<div class="skills-list">`;
      
       portfolioData.skills.forEach(skill => {
           const oscars = '🏆'.repeat(skill.rating);
           output += `
<div class="skill-item">
   <div class="skill-name">${skill.name}</div>
   <div class="skill-rating">${oscars}</div>
</div>`;
       });
      
       output += `</div></div>`;
       return output;
   },
  
   interests: function() {
       markCommandAsUsed('interests');
       return `
My Interests:
${portfolioData.interests.map(interest => `• ${interest}`).join('\n')}
`;
   },
  
   projects: function() {
       markCommandAsUsed('projects');
       let output = `<div class="projects-container">`;
      
       portfolioData.projects.forEach((project, index) => {
           output += `
<div class="project-card" style="animation-delay: ${index * 0.2}s">
   <div class="project-header">
       <span><a href="${project.link}" target="_blank" class="project-link">${project.name}</a></span>
       <span>1 - 0</span>
       <span>Me</span>
   </div>
   <div class="project-tech">
       <span class="font-semibold">Goal Scorers: </span>
       ${project.technologies.map(tech => `<span style="animation-delay: ${index * 0.1}s">⚽ ${tech}</span>`).join(' ')}
   </div>
</div>
`;
       });
      
       output += `</div>`;
       return output;
   },
  
   blog: function() {
       markCommandAsUsed('blog');
       let output = `<div class="blog-container">
<h2>My Latest Blog Posts:</h2>
<ul class="blog-list">`;


       portfolioData.blog.forEach(post => {
           output += `
<li class="blog-item">
   <div class="blog-header">
       <a href="${post.link}" target="_blank" class="blog-link">${post.title}</a>
       <span class="blog-date">${post.date}</span>
   </div>
   <div class="blog-snippet">${post.snippet}</div>
</li>
`;
       });


       output += `</ul></div>`;
       return output;
   },
  
   contact: function() {
       markCommandAsUsed('contact');
       return `
<div class="contact-container">
   <h2>Contact Information:</h2>
   <ul class="contact-list">
       <li><span class="contact-label">Email:</span> <a href="${portfolioData.contact.email}" class="contact-link">your.email@example.com</a></li>
       <li><span class="contact-label">GitHub:</span> <a href="${portfolioData.contact.github}" target="_blank" class="contact-link">github.com/yourusername</a></li>
       <li><span class="contact-label">LinkedIn:</span> <a href="${portfolioData.contact.linkedin}" target="_blank" class="contact-link">linkedin.com/in/yourusername</a></li>
       <li><span class="contact-label">Twitter:</span> <a href="${portfolioData.contact.twitter}" target="_blank" class="contact-link">twitter.com/yourusername</a></li>
   </ul>
</div>
`;
   },
  
   experience: function() {
       markCommandAsUsed('experience');
       let output = `<div class="experience-container">
<h2>Education:</h2>
<ul class="education-list">`;


       portfolioData.experience.education.forEach(edu => {
           output += `
   <li>
       <a href="${edu.link}" target="_blank" class="education-link">${edu.degree}, ${edu.institution}</a> (${edu.year})
   </li>`;
       });


       output += `
</ul>


<h2>Certifications:</h2>
<ul class="certifications-list">`;


       portfolioData.experience.certification.forEach(cert => {
           output += `
   <li>
       <a href="${cert.link}" target="_blank" class="certification-link">${cert.name}, ${cert.provider}</a> (${cert.year})
   </li>`;
       });


       output += `
</ul>
</div>`;


       return output;
   },
  
   clear: function() {
       markCommandAsUsed('clear');
       commandHistory.innerHTML = '';
       return '';
   },
  
   theme: function() {
       markCommandAsUsed('theme');
       toggleTheme();
       return '';
   }
};

function resetAllCommands() {
   usedCommands.clear();
   updateUnusedCommandsList();
   
   addToHistory("system", "All commands have been reset. Type 'help' to see available commands.");
}

function createHamburgerMenu() {
    // Create hamburger menu button
    hamburgerMenu = document.createElement('div');
    hamburgerMenu.className = 'hamburger-menu';
    hamburgerMenu.innerHTML = `
        <div class="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    document.body.appendChild(hamburgerMenu);
    
    // Add event listener to toggle unused commands visibility
    hamburgerMenu.addEventListener('click', function() {
        unusedCommandsElement.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!unusedCommandsElement.contains(event.target) && 
            !hamburgerMenu.contains(event.target) && 
            unusedCommandsElement.classList.contains('active')) {
            unusedCommandsElement.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        }
    });
}

function createUnusedCommandsElement() {
   if (!unusedCommandsElement) {
       unusedCommandsElement = document.createElement('div');
       unusedCommandsElement.className = 'unused-commands';
       document.body.appendChild(unusedCommandsElement);
       
       // Create hamburger menu for mobile
       if (window.innerWidth <= 768) {
           createHamburgerMenu();
       }
   }
  
   updateUnusedCommandsList();
}

function updateUnusedCommandsList() {
   const commandsList = Object.keys(commands);
   const unusedCommandsList = commandsList.filter(cmd => !usedCommands.has(cmd));
  
   if (unusedCommandsList.length === 0) {
       unusedCommandsElement.innerHTML = `
           <div class="unused-commands-header">All Commands Used!</div>
           <div class="reset-commands">Reset Commands</div>
       `;
      
       const resetButton = document.querySelector('.reset-commands');
       if (resetButton) {
           resetButton.addEventListener('click', resetAllCommands);
       }
      
       return;
   }
  
   unusedCommandsElement.innerHTML = `
       <div class="unused-commands-header">Discover More:</div>
       <div class="unused-commands-list">
           ${unusedCommandsList.map(cmd => `
               <div class="unused-command-item" data-command="${cmd}">
                   ${cmd}
               </div>
           `).join('')}
       </div>
   `;
  
   document.querySelectorAll('.unused-command-item').forEach(item => {
       item.addEventListener('click', function() {
           const cmd = this.getAttribute('data-command');
           terminalInput.value = cmd;
           terminalInput.focus();
           
           // On mobile, close the menu after selection
           if (window.innerWidth <= 768) {
               unusedCommandsElement.classList.remove('active');
               if (hamburgerMenu) {
                   hamburgerMenu.classList.remove('active');
               }
           }
       });
   });
}

function markCommandAsUsed(cmd) {
   usedCommands.add(cmd);
   if (unusedCommandsElement) {
       updateUnusedCommandsList();
   }
}

const loadingInterval = setInterval(() => {
   loadingText.textContent = glitchFrames[index];
   index = (index + 1) % glitchFrames.length;
}, 300);

setTimeout(() => {
   clearInterval(loadingInterval);
   loadingText.style.display = 'none';
   terminal.style.display = 'flex';
   terminalInput.focus();
  
   createUnusedCommandsElement();
   addToHistory("help", commands.help());
}, 3000);

function scrollToBottom() {
   if (terminalContent) {
       terminalContent.scrollTop = terminalContent.scrollHeight;
   }
}

// Handle mobile keyboard appearance
function handleMobileKeyboard() {
    // Original window height (without virtual keyboard)
    let windowHeight = window.innerHeight;
    
    window.addEventListener('resize', function() {
        // If the height is significantly reduced, the keyboard is likely visible
        if (window.innerHeight < windowHeight * 0.8) {
            document.body.classList.add('keyboard-open');
        } else {
            document.body.classList.remove('keyboard-open');
        }
        
        // Adjust hamburger menu visibility based on screen width
        if (window.innerWidth <= 768) {
            if (!hamburgerMenu) {
                createHamburgerMenu();
            }
            hamburgerMenu.style.display = 'block';
            unusedCommandsElement.classList.remove('active');
        } else if (hamburgerMenu) {
            hamburgerMenu.style.display = 'none';
            unusedCommandsElement.classList.add('active');
        }
    });
    
    // Handle input focus/blur for iOS devices where resize might not trigger
    terminalInput.addEventListener('focus', function() {
        // Small timeout to allow keyboard to appear
        setTimeout(function() {
            scrollToBottom();
            document.body.classList.add('keyboard-open');
        }, 300);
    });
    
    terminalInput.addEventListener('blur', function() {
        document.body.classList.remove('keyboard-open');
    });
}

// Detect touch devices
function setupTouchHandling() {
    if ('ontouchstart' in window) {
        // This is a touch device
        document.body.classList.add('touch-device');
        
        // Make commands in the unused commands list easier to tap
        const updateTouchSizes = () => {
            document.querySelectorAll('.unused-command-item').forEach(item => {
                item.style.padding = '15px';
            });
        };
        
        // Run initially and whenever list is updated
        updateTouchSizes();
        const originalUpdateList = updateUnusedCommandsList;
        updateUnusedCommandsList = function() {
            originalUpdateList();
            updateTouchSizes();
        };
        
        // Improve scrolling on mobile
        terminalContent.style.WebkitOverflowScrolling = 'touch';
    }
}

// Add to your window load event
window.addEventListener('load', function() {
    setTimeout(scrollToBottom, 3100);
    handleMobileKeyboard();
    setupTouchHandling();
    
    // Check initial screen size
    if (window.innerWidth <= 768) {
        if (hamburgerMenu) {
            hamburgerMenu.style.display = 'block';
        }
        if (unusedCommandsElement) {
            unusedCommandsElement.classList.remove('active');
        }
    }
});

function processCommand(cmd) {
   cmd = cmd.trim().toLowerCase();
  
   if (cmd === '') {
       return '';
   }
  
   if (commands[cmd]) {
       return commands[cmd]();
   } else {
       return `Command not found: ${cmd}. Type 'help' to see available commands.`;
   }
}

function addToHistory(input, output) {
   if (output === '') return; 
  
   const commandBlock = document.createElement('div');
   commandBlock.className = 'command-block';
  
   const commandInput = document.createElement('div');
   commandInput.className = 'command-input';
  
   if (input === 'system') {
       commandInput.innerHTML = `<span class="prompt">system:</span>`;
   } else {
       commandInput.innerHTML = `<span class="prompt">user@portfolio:~$</span> ${input}`;
   }
  
   const commandOutput = document.createElement('div');
   commandOutput.className = 'command-output';
   commandOutput.innerHTML = output;
  
   commandBlock.appendChild(commandInput);
   commandBlock.appendChild(commandOutput);
  
   commandHistory.appendChild(commandBlock);
  
   scrollToBottom();
}

// add command to history array for up/down navigation
function addCommandToHistory(cmd) {
    // don't add empty commands or duplicates at the end
    if (cmd.trim() !== '' && (commandsHistory.length == 0 || commandsHistory[commandsHistory.length -1] !== cmd)) {
        commandsHistory.push(cmd);

        // reset history index to point to the end
        historyIndex = commandsHistory.length;
    }
}

// add clipboard and command history navigation fuctionality
terminalInput.addEventListener('keydown', function(e) {
    
    // enter key - process command
    if (e.key == 'Enter') {
        const input = terminalInput.value;

        // add valid commands to history
        if (input.trim() !== '') {
            addCommandToHistory(input);
        }

        const output = processCommand(input);

        if (output != '') {
            addToHistory(input, output);
        } else {
            setTimeout(scrollToBottom, 100);
        }

        terminalInput.value = '';
        historyIndex = commandsHistory.length; // reset history index after command execution
    }

    // Up arrow - navigate command history backward
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandsHistory.length > 0 && historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandsHistory[historyIndex];
            
            // Move cursor to end of input
            setTimeout(() => {
                terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
            }, 0);
        }
    }

    // Down arrow - navigate command history forward
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandsHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandsHistory[historyIndex];
        } else if (historyIndex === commandsHistory.length - 1) {
            // At the end of history, clear the input
            historyIndex = commandsHistory.length;
            terminalInput.value = '';
        }
    }
});

// Make the terminal content selectable for copy functionality
terminalContent.addEventListener('mouseup', function(e) {
    const selection = window.getSelection().toString();
    if (selection) {
        // Make selection available for copying with Ctrl+C
        document.execCommand('copy');
    }
});

// Add copy event listener to document
document.addEventListener('copy', function(e) {
    const selection = window.getSelection().toString();
    if (selection) {
        e.clipboardData.setData('text/plain', selection);
        e.preventDefault();
    }
});

// Add paste event listener to terminal input
terminalInput.addEventListener('paste', function(e) {
    // Let the default paste behavior happen
    // The browser will automatically handle Ctrl+V
});

function toggleTheme() {
   darkMode = !darkMode;
  
   document.body.classList.toggle('light-mode');
   terminal.classList.toggle('light-mode');
   if (unusedCommandsElement) {
       unusedCommandsElement.classList.toggle('light-mode');
   }
   if (hamburgerMenu) {
       hamburgerMenu.classList.toggle('light-mode');
   }
  
   if (darkMode) {
       moonIcon.classList.remove('hidden');
       sunIcon.classList.add('hidden');
   } else {
       moonIcon.classList.add('hidden');
       sunIcon.classList.remove('hidden');
   }
}

themeToggle.addEventListener('click', function() {
   toggleTheme();
   setTimeout(scrollToBottom, 100);
});

terminal.addEventListener('click', function() {
   terminalInput.focus();
});

const observer = new MutationObserver(function(mutations) {
   scrollToBottom();
});

if (terminalContent) {
   observer.observe(terminalContent, { childList: true, subtree: true });
}

document.querySelectorAll('.skills-container, .projects-container, .contact-container, .experience-container, .blog-container').forEach(container => {
   if (container) {
       container.addEventListener('DOMNodeInserted', scrollToBottom);
   }
});

window.addEventListener('load', function() {
   setTimeout(scrollToBottom, 3100); 
});

// Add swipe functionality for mobile
function setupSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 100;
        if (touchEndX - touchStartX > swipeThreshold && window.innerWidth <= 768) {
            // Swipe right - show menu
            unusedCommandsElement.classList.add('active');
            if (hamburgerMenu) {
                hamburgerMenu.classList.add('active');
            }
        } else if (touchStartX - touchEndX > swipeThreshold && window.innerWidth <= 768) {
            // Swipe left - hide menu
            unusedCommandsElement.classList.remove('active');
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('active');
            }
        }
    }
}

// Initialize swipe functionality
setupSwipeGestures();