from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm


def draw_line(c, x1, y, x2):
    c.line(x1, y, x2, y)


def generate_pdf(path):
    c = canvas.Canvas(path, pagesize=A4)
    width, height = A4
    margin = 20 * mm
    y = height - margin

    # Header
    c.setFont("Helvetica-Bold", 14)
    header = "Feuille de service – Mikael – Les Entreprises Jessica Mikael Inc."
    c.drawString(margin, y, header)
    y -= 20 * mm

    c.setFont("Helvetica", 12)
    line_height = 8 * mm
    field_gap = 12 * mm

    def labeled_line(label_text):
        nonlocal y
        c.drawString(margin, y, label_text)
        draw_line(c, margin + 40 * mm, y - 2 * mm, width - margin)
        y -= field_gap

    labeled_line("Date :")
    labeled_line("Heure :")
    labeled_line("Nom du client :")
    labeled_line("Adresse :")

    c.drawString(margin, y, "Services effectués :")
    y -= line_height
    for _ in range(4):
        draw_line(c, margin, y, width - margin)
        y -= line_height
    y -= 4 * mm

    labeled_line("Prix total :")

    # Payment method checkboxes
    c.drawString(margin, y, "Mode de paiement :")
    x = margin + 50 * mm
    box = 4 * mm
    c.rect(x, y - 3, box, box)
    c.drawString(x + 6 * mm, y, "Argent")
    x += 35 * mm
    c.rect(x, y - 3, box, box)
    c.drawString(x + 6 * mm, y, "Virement")
    x += 38 * mm
    c.rect(x, y - 3, box, box)
    c.drawString(x + 6 * mm, y, "Crédit")
    y -= field_gap

    labeled_line("Signature de Mikael :")

    c.rect(margin, y - 3, box, box)
    c.drawString(margin + 6 * mm, y, "À facturer")

    c.showPage()
    c.save()


if __name__ == "__main__":
    generate_pdf("service_sheet_fr.pdf")
