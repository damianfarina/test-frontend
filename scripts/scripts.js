$(function() {
  var menuItems, sections;
  $('#fullscreen-toggle').on('click', function() {
    return $('.container').toggleClass('fullscreen');
  });
  menuItems = $(".nav-links a");
  sections = menuItems.map(function() {
    var item;
    item = $($(this).attr("href"));
    if (item.length) {
      return item;
    }
  });
  return $('.content').on('scroll', function() {
    var currentSection, sectionId, sectionsBelow, threshold, top, windowHeight;
    top = $(this).scrollTop();
    windowHeight = $(window).outerHeight();
    threshold = top - windowHeight;
    sectionsBelow = sections.map(function() {
      var offset;
      offset = $(this).offset();
      if (offset.top < threshold) {
        return this;
      }
    });
    currentSection = sectionsBelow[sectionsBelow.length - 1] || sections[0];
    sectionId = currentSection && currentSection.length ? currentSection.attr('id') : '';
    return menuItems.parent().removeClass("active").end().filter("[href='#" + sectionId + "']").parent().addClass("active");
  });
});

//# sourceMappingURL=scripts.js.map
