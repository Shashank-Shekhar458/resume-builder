function generatePDF() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const summary = document.getElementById("summary").value;
  const skills = document.getElementById("skills").value;
  const education = document.getElementById("education").value;
  const experience = document.getElementById("experience").value;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  // ✅ Page overflow handler
  function checkPageOverflow() {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }

  const photoInput = document.getElementById("photo");

  function generateContent(imageData = null) {

    // 🔥 Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(name, 20, y);

    // 📸 Photo
    if (imageData) {
      doc.addImage(imageData, "JPEG", 150, 15, 40, 40);
    }

    y += 10;

    // Contact
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`${email} | ${phone}`, 20, y);

    y += 8;

    // ✅ Line (photo ke pehle rukegi)
    doc.line(20, y, 140, y);

    y += 10;

    // 🔹 Normal Section (Summary)
    function addSection(title, content) {
      if (!content) return;

      checkPageOverflow();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, 20, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const lines = doc.splitTextToSize(content, 170);

      lines.forEach(line => {
        checkPageOverflow();
        doc.text(line, 20, y);
        y += 6;
      });

      y += 6;
    }

    // 🔥 PERFECT BULLET SECTION (ALL FIXED)
    function addBulletSection(title, content) {
      if (!content) return;

      checkPageOverflow();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, 20, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      // split by comma OR new line
      const items = content.split(/,|\n/);

      items.forEach(item => {
        const text = item.trim();
        if (!text) return;

        // wrap long text
        const lines = doc.splitTextToSize(text, 150);

        lines.forEach((line, index) => {
          checkPageOverflow();

          if (index === 0) {
            doc.text("• " + line, 20, y);
          } else {
            doc.text(line, 25, y); // indent fix
          }

          y += 6;
        });

        y += 2;
      });

      y += 6;
    }

    // Sections
    addSection("Profile Summary", summary);
    addBulletSection("Skills", skills);
    addBulletSection("Education", education);
    addBulletSection("Experience", experience);

    // Watermark
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(30);
    doc.text("FREE", 70, 150, { angle: 45 });

    // Save
    doc.save(name + "_Resume.pdf");
  }

  // 📸 Image handling
  if (photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      generateContent(e.target.result);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    generateContent();
  }
}