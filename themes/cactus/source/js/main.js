function setupGoyoMode() {
  var goyoToggle = document.getElementById("goyo-toggle");
  if (goyoToggle) {
    var goyoStorageKey = "zququ-goyo-mode";
    var setGoyoMode = function(active) {
      document.body.classList.toggle("goyo-active", active);
      goyoToggle.setAttribute("aria-pressed", active ? "true" : "false");
      goyoToggle.setAttribute("aria-label", active ? "Exit Goyo reading mode" : "Enter Goyo reading mode");
      goyoToggle.textContent = "goyo";
      try {
        window.localStorage.setItem(goyoStorageKey, active ? "1" : "0");
      } catch (err) {}
    };

    try {
      setGoyoMode(window.localStorage.getItem(goyoStorageKey) === "1");
    } catch (err) {
      setGoyoMode(false);
    }

    goyoToggle.addEventListener("click", function() {
      setGoyoMode(!document.body.classList.contains("goyo-active"));
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && document.body.classList.contains("goyo-active")) {
        setGoyoMode(false);
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupGoyoMode);
} else {
  setupGoyoMode();
}

function setupReaderNotes() {
  var article = document.querySelector("article.post .content.e-content");
  if (!article || !window.localStorage) {
    return;
  }

  var storageKey = "zququ-reader-notes:" + window.location.pathname;
  var state = loadState();
  var noteMode = false;
  var activeSelection = null;
  var selectionTimer = null;

  var controls = document.createElement("div");
  controls.id = "reader-note-controls";
  controls.innerHTML = [
    "<button id=\"reader-note-toggle\" type=\"button\" aria-pressed=\"false\">note</button>",
    "<button id=\"reader-note-visibility\" type=\"button\">hide</button>"
  ].join("");
  document.body.appendChild(controls);

  var layer = document.createElement("div");
  layer.id = "reader-note-layer";
  document.body.appendChild(layer);

  var toolbar = document.createElement("div");
  toolbar.id = "reader-note-toolbar";
  toolbar.innerHTML = [
    "<button type=\"button\" data-action=\"highlight\">mark</button>",
    "<button type=\"button\" data-action=\"note\">note</button>"
  ].join("");
  document.body.appendChild(toolbar);

  var composer = document.createElement("div");
  composer.id = "reader-note-composer";
  composer.innerHTML = [
    "<textarea rows=\"3\" placeholder=\"write a side note...\"></textarea>",
    "<div class=\"reader-note-composer-actions\">",
    "<button type=\"button\" data-action=\"cancel\">cancel</button>",
    "<button type=\"button\" data-action=\"save\">save</button>",
    "</div>"
  ].join("");
  document.body.appendChild(composer);

  var noteToggle = document.getElementById("reader-note-toggle");
  var visibilityToggle = document.getElementById("reader-note-visibility");
  var composerTextarea = composer.querySelector("textarea");
  var composerContext = null;

  applyStoredHighlights();
  setNotesHidden(!!state.hidden, false);
  renderNotes();

  noteToggle.addEventListener("click", function() {
    noteMode = !noteMode;
    document.body.classList.toggle("reader-note-mode", noteMode);
    noteToggle.setAttribute("aria-pressed", noteMode ? "true" : "false");
  });

  visibilityToggle.addEventListener("click", function() {
    setNotesHidden(!document.body.classList.contains("reader-notes-hidden"), true);
  });

  toolbar.addEventListener("mousedown", function(event) {
    event.preventDefault();
  });

  toolbar.addEventListener("click", function(event) {
    var action = event.target.getAttribute("data-action");
    if (!action || !activeSelection) {
      return;
    }
    if (action === "highlight") {
      addHighlight(activeSelection);
      hideToolbar();
      clearSelection();
    } else if (action === "note") {
      openComposer(activeSelection.x, activeSelection.y, activeSelection.side, activeSelection.text);
      hideToolbar();
    }
  });

  composer.addEventListener("click", function(event) {
    var action = event.target.getAttribute("data-action");
    if (!action) {
      return;
    }
    if (action === "cancel") {
      closeComposer();
    } else if (action === "save") {
      saveComposerNote();
    }
  });

  composerTextarea.addEventListener("keydown", function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      saveComposerNote();
    }
    if (event.key === "Escape") {
      closeComposer();
    }
  });

  document.addEventListener("selectionchange", function() {
    window.clearTimeout(selectionTimer);
    selectionTimer = window.setTimeout(updateSelectionToolbar, 120);
  });

  document.addEventListener("click", function(event) {
    if (!noteMode) {
      return;
    }
    if (event.target.closest("#reader-note-controls, #reader-note-toolbar, #reader-note-composer, .reader-note-bubble")) {
      return;
    }
    if (event.target.closest("a, button, input, textarea, select")) {
      return;
    }
    event.preventDefault();
    hideToolbar();
    clearSelection();
    openComposer(event.pageX, event.pageY, getSideFromX(event.clientX), "");
  }, true);

  layer.addEventListener("click", function(event) {
    if (!event.target.classList.contains("reader-note-delete")) {
      return;
    }
    var id = event.target.closest(".reader-note-bubble").getAttribute("data-note-id");
    state.notes = state.notes.filter(function(note) {
      return note.id !== id;
    });
    saveState();
    renderNotes();
  });

  window.addEventListener("resize", renderNotes);

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      hideToolbar();
      closeComposer();
      if (noteMode) {
        noteMode = false;
        document.body.classList.remove("reader-note-mode");
        noteToggle.setAttribute("aria-pressed", "false");
      }
    }
  });

  function loadState() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (raw) {
        var parsed = JSON.parse(raw);
        return {
          highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
          hidden: !!parsed.hidden
        };
      }
    } catch (err) {}
    return { highlights: [], notes: [], hidden: false };
  }

  function saveState() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (err) {}
  }

  function makeId(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function setNotesHidden(hidden, persist) {
    state.hidden = hidden;
    document.body.classList.toggle("reader-notes-hidden", hidden);
    visibilityToggle.textContent = hidden ? "show" : "hide";
    visibilityToggle.setAttribute("aria-pressed", hidden ? "true" : "false");
    if (persist) {
      saveState();
    }
  }

  function clearSelection() {
    var selection = window.getSelection && window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }

  function hideToolbar() {
    toolbar.classList.remove("is-visible");
    activeSelection = null;
  }

  function updateSelectionToolbar() {
    if (document.body.classList.contains("reader-notes-hidden")) {
      hideToolbar();
      return;
    }
    var selection = window.getSelection && window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      hideToolbar();
      return;
    }

    var range = selection.getRangeAt(0);
    if (!article.contains(range.commonAncestorContainer)) {
      hideToolbar();
      return;
    }

    var text = selection.toString().replace(/\s+/g, " ").trim();
    if (!text) {
      hideToolbar();
      return;
    }

    var rect = range.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) {
      hideToolbar();
      return;
    }

    var startOffset = getTextOffset(range);
    var sameBlock = getTextBlock(range.startContainer) === getTextBlock(range.endContainer);
    activeSelection = {
      range: range.cloneRange(),
      start: startOffset,
      end: startOffset + selection.toString().length,
      text: text.slice(0, 240),
      x: window.scrollX + rect.left + rect.width / 2,
      y: window.scrollY + rect.bottom + 10,
      side: getSideFromX(rect.left + rect.width / 2),
      sameBlock: sameBlock
    };

    toolbar.style.left = Math.max(16, window.scrollX + rect.left + rect.width / 2 - 58) + "px";
    toolbar.style.top = Math.max(16, window.scrollY + rect.top - 42) + "px";
    toolbar.classList.add("is-visible");
  }

  function getTextBlock(node) {
    var element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return element && element.closest("p, li, figcaption, blockquote, h1, h2, h3, h4, h5, h6");
  }

  function getTextOffset(range) {
    var prefixRange = document.createRange();
    prefixRange.selectNodeContents(article);
    prefixRange.setEnd(range.startContainer, range.startOffset);
    return prefixRange.toString().length;
  }

  function addHighlight(selectionInfo) {
    if (!selectionInfo.sameBlock || selectionInfo.end <= selectionInfo.start) {
      return;
    }
    var id = makeId("hl");
    state.highlights.push({
      id: id,
      start: selectionInfo.start,
      end: selectionInfo.end,
      text: selectionInfo.text
    });
    saveState();
    wrapRange(selectionInfo.range, id);
  }

  function applyStoredHighlights() {
    state.highlights
      .slice()
      .sort(function(a, b) { return b.start - a.start; })
      .forEach(function(highlight) {
        wrapOffsets(highlight.start, highlight.end, highlight.id);
      });
  }

  function wrapOffsets(start, end, id) {
    var walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        return shouldUseTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var current = 0;
    var startNode = null;
    var endNode = null;
    var startNodeOffset = 0;
    var endNodeOffset = 0;
    var node;

    while ((node = walker.nextNode())) {
      var length = node.nodeValue.length;
      var next = current + length;
      if (!startNode && start >= current && start <= next) {
        startNode = node;
        startNodeOffset = start - current;
      }
      if (startNode && end >= current && end <= next) {
        endNode = node;
        endNodeOffset = end - current;
        break;
      }
      current = next;
    }

    if (!startNode || !endNode) {
      return;
    }

    var range = document.createRange();
    range.setStart(startNode, startNodeOffset);
    range.setEnd(endNode, endNodeOffset);
    wrapRange(range, id);
  }

  function shouldUseTextNode(node) {
    if (!node.nodeValue) {
      return false;
    }
    var parent = node.parentElement;
    if (!parent) {
      return false;
    }
    return !parent.closest("pre, code, script, style, textarea, .reader-highlight");
  }

  function wrapRange(range, id) {
    try {
      var mark = document.createElement("mark");
      mark.className = "reader-highlight";
      mark.setAttribute("data-highlight-id", id);
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
    } catch (err) {}
  }

  function openComposer(pageX, pageY, side, quote) {
    composerContext = {
      pageX: pageX,
      pageY: pageY,
      side: side || "right",
      quote: quote || ""
    };
    composerTextarea.value = "";
    composer.style.left = clamp(pageX - window.scrollX - 120, 18, window.innerWidth - 298) + "px";
    composer.style.top = clamp(pageY - window.scrollY + 12, 18, window.innerHeight - 168) + "px";
    composer.classList.add("is-visible");
    composerTextarea.focus();
  }

  function closeComposer() {
    composer.classList.remove("is-visible");
    composerContext = null;
  }

  function saveComposerNote() {
    if (!composerContext) {
      return;
    }
    var text = composerTextarea.value.replace(/\s+/g, " ").trim();
    if (!text) {
      closeComposer();
      return;
    }
    state.notes.push({
      id: makeId("note"),
      y: Math.max(0, composerContext.pageY - getArticleTop()),
      side: composerContext.side,
      text: text,
      quote: composerContext.quote,
      createdAt: new Date().toISOString()
    });
    saveState();
    closeComposer();
    renderNotes(true);
  }

  function renderNotes(markNewest) {
    layer.innerHTML = "";
    if (document.body.classList.contains("reader-notes-hidden")) {
      return;
    }
    state.notes.forEach(function(note, index) {
      var bubble = document.createElement("div");
      bubble.className = "reader-note-bubble" + (markNewest && index === state.notes.length - 1 ? " is-new" : "");
      bubble.setAttribute("data-note-id", note.id);
      bubble.setAttribute("data-side", note.side || "right");
      bubble.style.top = Math.round(getArticleTop() + note.y) + "px";

      var quote = document.createElement("div");
      quote.className = "reader-note-quote";
      quote.textContent = note.quote ? "「" + note.quote.slice(0, 42) + (note.quote.length > 42 ? "..." : "") + "」" : "side note";

      var text = document.createElement("div");
      text.className = "reader-note-text";
      text.textContent = note.text;

      var del = document.createElement("button");
      del.className = "reader-note-delete";
      del.type = "button";
      del.setAttribute("aria-label", "Delete note");
      del.textContent = "×";

      bubble.appendChild(quote);
      bubble.appendChild(text);
      bubble.appendChild(del);
      layer.appendChild(bubble);
      positionBubble(bubble, note.side || "right");
    });
  }

  function positionBubble(bubble, side) {
    var articleRect = article.getBoundingClientRect();
    var width = bubble.offsetWidth || 260;
    var leftSpace = articleRect.left - 32;
    var rightSpace = window.innerWidth - articleRect.right - 32;
    var left;

    if (window.innerWidth < 980) {
      left = window.innerWidth - width - 16;
    } else if (side === "left" && leftSpace >= width) {
      left = articleRect.left - width - 28;
    } else if (rightSpace >= width) {
      left = articleRect.right + 28;
    } else if (leftSpace >= width) {
      left = articleRect.left - width - 28;
    } else {
      left = window.innerWidth - width - 16;
    }

    bubble.style.left = Math.max(16, Math.round(left + window.scrollX)) + "px";
  }

  function getArticleTop() {
    return article.getBoundingClientRect().top + window.scrollY;
  }

  function getSideFromX(clientX) {
    var rect = article.getBoundingClientRect();
    return clientX < rect.left + rect.width / 2 ? "left" : "right";
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupReaderNotes);
} else {
  setupReaderNotes();
}

if (typeof window.jQuery !== "undefined") {
  var $ = window.jQuery;

  /**
   * Sets up Justified Gallery.
   */
  if (!!$.prototype.justifiedGallery) {
    var options = {
      rowHeight: 140,
      margins: 4,
      lastRow: "justify"
    };
    $(".article-gallery").justifiedGallery(options);
  }

$(document).ready(function() {

  /**
   * Shows the responsive navigation menu on mobile.
   */
  $("#header > #nav > ul > .icon").click(function() {
    $("#header > #nav > ul").toggleClass("responsive");
  });


  /**
   * Controls the different versions of  the menu in blog post articles 
   * for Desktop, tablet and mobile.
   */
  if ($(".post").length) {
    var menu = $("#menu");
    var nav = $("#menu > #nav");
    var menuIcon = $("#menu-icon, #menu-icon-tablet");

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    if ($(document).width() >= 1440) {
      menu.show();
      menuIcon.addClass("active");
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    menuIcon.click(function() {
      if (menu.is(":hidden")) {
        menu.show();
        menuIcon.addClass("active");
      } else {
        menu.hide();
        menuIcon.removeClass("active");
      }
      return false;
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    if (menu.length) {
      $(window).on("scroll", function() {
        var topDistance = menu.offset().top;

        // hide only the navigation links on desktop
        if (!nav.is(":visible") && topDistance < 50) {
          nav.show();
        } else if (nav.is(":visible") && topDistance > 100) {
          nav.hide();
        }

        // on tablet, hide the navigation icon as well and show a "scroll to top
        // icon" instead
        if ( ! $( "#menu-icon" ).is(":visible") && topDistance < 50 ) {
          $("#menu-icon-tablet").show();
          $("#top-icon-tablet").hide();
        } else if (! $( "#menu-icon" ).is(":visible") && topDistance > 100) {
          $("#menu-icon-tablet").hide();
          $("#top-icon-tablet").show();
        }
      });
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    if ($( "#footer-post").length) {
      var lastScrollTop = 0;
      $(window).on("scroll", function() {
        var topDistance = $(window).scrollTop();

        if (topDistance > lastScrollTop){
          // downscroll -> show menu
          $("#footer-post").hide();
        } else {
          // upscroll -> hide menu
          $("#footer-post").show();
        }
        lastScrollTop = topDistance;

        // close all submenu"s on scroll
        $("#nav-footer").hide();
        $("#toc-footer").hide();
        $("#share-footer").hide();

        // show a "navigation" icon when close to the top of the page, 
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          $("#actions-footer > #top").hide();
        } else if (topDistance > 100) {
          $("#actions-footer > #top").show();
        }
      });
    }
  }
});
}
