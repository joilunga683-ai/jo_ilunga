const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
  mainNav?.classList.toggle("is-open", !isOpen);
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const projectFilters = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const emptyResults = document.querySelector(".empty-results");
projectFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    let visibleCount = 0;
    projectFilters.forEach((button) => {
      const isActive = button === filter;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    projectCards.forEach((card) => {
      const isVisible = category === "all" || card.dataset.category === category;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (emptyResults) emptyResults.hidden = visibleCount !== 0;
  });
});

const projectDetails = {
  "tour-lumen": {
    title: "Tour Lumen",
    meta: "STRUCTURE MIXTE · MONTRÉAL · 2025",
    description: "Coordination de la structure et de l’enveloppe d’un ensemble résidentiel de 24 étages et 186 logements. Mandat : suivi des interfaces techniques, validation des plans d’exécution et accompagnement des équipes sur le chantier."
  },
  "pavillon-des-rives": {
    title: "Pavillon des Rives",
    meta: "RÉHABILITATION · LONGUEUIL · 2024",
    description: "Réfection et mise aux normes d’un bâtiment public de 3 200 m². Le mandat a intégré l’évaluation de l’existant, la coordination des travaux et le maintien des activités pendant le chantier."
  },
  "passerelle-nord": {
    title: "Passerelle du Nord",
    meta: "INFRASTRUCTURE · LAVAL · 2023",
    description: "Conception et suivi de chantier d’un ouvrage piéton de 68 m. Une coordination étroite des séquences de montage a permis de limiter les interruptions et de maîtriser les interfaces avec les aménagements voisins."
  },
  "cour-des-arts": {
    title: "Cour des Arts",
    meta: "STRUCTURE BOIS · MONTRÉAL · 2022",
    description: "Réalisation d’un équipement culturel de 2 100 m² combinant bois et béton. Le travail a porté sur la coordination structurelle, l’assurance qualité et la préparation des inspections de chantier."
  }
};

const projectDialog = document.querySelector(".project-dialog");
if (projectDialog) {
  document.querySelectorAll("[data-project]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const project = projectDetails[trigger.dataset.project];
      if (!project) return;
      projectDialog.querySelector("[data-dialog-title]").textContent = project.title;
      projectDialog.querySelector("[data-dialog-meta]").textContent = project.meta;
      projectDialog.querySelector("[data-dialog-description]").textContent = project.description;
      projectDialog.showModal();
    });
  });
  projectDialog.querySelector(".dialog-close")?.addEventListener("click", () => projectDialog.close());
  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
}

const contactForm = document.querySelector("#contact-form");
const formSubmitEndpoint = "https://formsubmit.co/ajax/joconstruction683@gmail.com";
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const status = document.querySelector("#form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());
  if (status) status.textContent = "Envoi de votre message…";
  submitButton.disabled = true;

  try {
    const response = await fetch(formSubmitEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== "true")) {
      throw new Error(result.message || "Le service de messagerie a refusé le message.");
    }
    if (status) status.textContent = "Votre message a été transmis à Josué. Merci de l’avoir contacté.";
    contactForm.reset();
  } catch (error) {
    if (status) status.textContent = `L’envoi a échoué : ${error.message || "vérifiez votre connexion et réessayez."}`;
  } finally {
    submitButton.disabled = false;
  }
});

const registrationForm = document.querySelector("#registration-form");
const registrationTicket = document.querySelector("#registration-ticket");
registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!registrationForm.reportValidity() || !registrationTicket) return;

  const formData = new FormData(registrationForm);
  const ticketNumber = `PRE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const registration = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    course: formData.get("course"),
    logo: registrationForm.querySelector("#registration-course").selectedOptions[0].dataset.logo
  };

  document.querySelector("#ticket-number").textContent = ticketNumber;
  document.querySelector("#ticket-name").textContent = registration.name;
  document.querySelector("#ticket-email").textContent = registration.email;
  document.querySelector("#ticket-course").textContent = registration.course;
  document.querySelector("#ticket-phone").textContent = registration.phone;
  const courseLogo = document.querySelector("#ticket-course-logo");
  courseLogo.src = registration.logo;
  courseLogo.alt = `Logo ${registration.course}`;
  courseLogo.hidden = false;
  document.querySelector("#ticket-date").textContent = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date());

  const subject = `[Préinscription] ${registration.course}`;
  const body = `Bonjour,\n\nJe souhaite m’inscrire au module ${registration.course}.\n\nNom : ${registration.name}\nCourriel : ${registration.email}\nTéléphone : ${registration.phone}\nTicket : ${ticketNumber}`;
  document.querySelector("#registration-email-link").href = `mailto:joconstruction683@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  registrationTicket.hidden = false;
  registrationTicket.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const status = document.querySelector("#registration-status");
  const submitButton = registrationForm.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(formData.entries());
  payload._subject = subject;
  payload.ticket = ticketNumber;
  if (status) status.textContent = "Envoi de votre demande…";
  submitButton.disabled = true;
  try {
    const response = await fetch(formSubmitEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== "true")) {
      throw new Error(result.message || "Le service de messagerie a refusé la demande.");
    }
    if (status) status.textContent = "Votre demande a été envoyée à Josué. Le ticket est prêt à être imprimé.";
  } catch (error) {
    if (status) status.textContent = `L’envoi a échoué : ${error.message || "vous pouvez utiliser le lien courriel ci-dessous."}`;
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#print-ticket")?.addEventListener("click", () => {
  document.body.classList.add("print-registration");
  window.print();
});
window.addEventListener("afterprint", () => document.body.classList.remove("print-registration"));

document.querySelector("#download-ticket")?.addEventListener("click", async () => {
  const ticket = {
    number: document.querySelector("#ticket-number").textContent,
    name: document.querySelector("#ticket-name").textContent,
    email: document.querySelector("#ticket-email").textContent,
    phone: document.querySelector("#ticket-phone").textContent,
    course: document.querySelector("#ticket-course").textContent,
    date: document.querySelector("#ticket-date").textContent,
    logo: document.querySelector("#ticket-course-logo")
  };
  await ticket.logo.decode();
  const logoCanvas = document.createElement("canvas");
  const logoScale = Math.min(1, 128 / Math.max(ticket.logo.naturalWidth, ticket.logo.naturalHeight));
  logoCanvas.width = Math.max(1, Math.round(ticket.logo.naturalWidth * logoScale));
  logoCanvas.height = Math.max(1, Math.round(ticket.logo.naturalHeight * logoScale));
  const logoContext = logoCanvas.getContext("2d");
  if (!logoContext) throw new Error("Impossible de préparer le logo du module pour le PDF.");
  logoContext.fillStyle = "#ffffff";
  logoContext.fillRect(0, 0, logoCanvas.width, logoCanvas.height);
  logoContext.drawImage(ticket.logo, 0, 0, logoCanvas.width, logoCanvas.height);
  const logoBase64 = logoCanvas.toDataURL("image/jpeg", 0.9).split(",")[1];
  const logoBinary = atob(logoBase64);
  const logoBytes = Uint8Array.from(logoBinary, (character) => character.charCodeAt(0));
  const logoDisplayScale = 34 / Math.max(logoCanvas.width, logoCanvas.height);
  const logoDisplayWidth = logoCanvas.width * logoDisplayScale;
  const logoDisplayHeight = logoCanvas.height * logoDisplayScale;
  const pageWidth = 595;
  const pageHeight = 842;
  const topToPdfY = (top) => pageHeight - top;
  const winAnsiSpecials = {
    "€": 128, "‚": 130, "ƒ": 131, "„": 132, "…": 133, "†": 134,
    "‡": 135, "ˆ": 136, "‰": 137, "Š": 138, "‹": 139, "Œ": 140,
    "Ž": 142, "‘": 145, "’": 146, "“": 147, "”": 148, "•": 149,
    "–": 150, "—": 151, "˜": 152, "™": 153, "š": 154, "›": 155,
    "œ": 156, "ž": 158, "Ÿ": 159
  };
  const toWinAnsiHex = (value) => Array.from(value, (character) => {
    const code = winAnsiSpecials[character] ?? character.codePointAt(0);
    return (code <= 255 ? code : 63).toString(16).padStart(2, "0");
  }).join("").toUpperCase();
  const wrapText = (value, maxLength = 72) => {
    const words = value.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      if (word.length > maxLength) {
        if (line) lines.push(line);
        line = "";
        for (let index = 0; index < word.length; index += maxLength) {
          lines.push(word.slice(index, index + maxLength));
        }
      } else if (line && `${line} ${word}`.length > maxLength) {
        lines.push(line);
        line = word;
      } else {
        line = line ? `${line} ${word}` : word;
      }
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  };
  const textCommand = (value, x, top, font, size, color) => {
    const [red, green, blue] = color;
    return `BT /${font} ${size} Tf ${red} ${green} ${blue} rg 1 0 0 1 ${x} ${topToPdfY(top)} Tm <${toWinAnsiHex(value)}> Tj ET`;
  };
  const content = [
    "q 0.95 0.97 0.95 rg 0 680 595 162 re f Q",
    textCommand("TICKET DE PREINSCRIPTION", 78, 184, "F2", 11, "0.28 0.41 0.32"),
    textCommand(ticket.number, 405, 184, "F2", 10, "0.85 0.32 0.21"),
    textCommand("Preinscription aux modules de construction", 78, 226, "F2", 21, "0.11 0.16 0.14")
  ];
  let positionTop = 278;
  const fields = [
    ["Participant", ticket.name],
    ["Courriel", ticket.email],
    ["Telephone", ticket.phone],
    ["Module", ticket.course],
    ["Emis le", ticket.date]
  ];
  fields.forEach(([label, value]) => {
    const lines = wrapText(value);
    content.push(textCommand(label, 78, positionTop, "F2", 9, "0.34 0.40 0.36"));
    lines.forEach((line, index) => {
      content.push(textCommand(line, 78, positionTop + 20 + index * 15, "F1", 12, "0.11 0.16 0.14"));
    });
    if (label === "Module") {
      content.push(`q ${logoDisplayWidth} 0 0 ${logoDisplayHeight} 390 ${topToPdfY(positionTop + 45)} cm /Logo Do Q`);
    }
    positionTop += 49 + (lines.length - 1) * 15;
  });
  const footerTop = positionTop + 10;
  const cardBottom = footerTop + 28;
  content.push(`q 0.55 0.64 0.58 RG 1.2 w 56 ${pageHeight - cardBottom} ${pageWidth - 112} ${cardBottom - 142} re S Q`);
  content.push(`q 0.85 0.85 0.82 RG 0.6 w 78 ${topToPdfY(footerTop - 13)} m 517 ${topToPdfY(footerTop - 13)} l S Q`);
  content.push(textCommand("Preinscription en attente de confirmation par l'organisateur. @Jocibanda", 78, footerTop + 5, "F1", 9, "0.34 0.40 0.36"));

  const stream = content.join("\n");
  const objectHeaders = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << /Logo 7 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
  ];
  const chunks = [];
  let byteLength = 0;
  const appendText = (value) => {
    const bytes = new TextEncoder().encode(value);
    chunks.push(bytes);
    byteLength += bytes.length;
  };
  const offsets = [0];
  appendText("%PDF-1.4\n%Ticket\n");
  objectHeaders.forEach((object, index) => {
    offsets.push(byteLength);
    appendText(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });
  offsets.push(byteLength);
  appendText(`6 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);
  offsets.push(byteLength);
  appendText(`7 0 obj\n<< /Type /XObject /Subtype /Image /Width ${logoCanvas.width} /Height ${logoCanvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBytes.length} >>\nstream\n`);
  chunks.push(logoBytes);
  byteLength += logoBytes.length;
  appendText("\nendstream\nendobj\n");
  const xrefOffset = byteLength;
  appendText(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => {
    appendText(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  appendText(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  const url = URL.createObjectURL(new Blob(chunks, { type: "application/pdf" }));
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `ticket-${ticket.number}.pdf`;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});