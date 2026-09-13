import React from 'react';

function PrintItineraryButton({ tour }) {
  const handlePrint = () => {
    if (!tour) return;

    const itineraryDays = tour.itinerary && tour.itinerary.length > 0
      ? tour.itinerary
          .map(
            (day) => `
              <div style="margin-bottom:18px; padding:16px; background:#f9f9f7; border-left:4px solid #556B2F; border-radius:6px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                  <span style="background:#556B2F; color:white; padding:3px 12px; border-radius:20px; font-size:0.8rem; font-weight:700;">Day ${day.day}</span>
                  <strong style="font-size:1rem; color:#333;">${day.title}</strong>
                </div>
                <p style="margin:0; color:#555; line-height:1.6; font-size:0.92rem;">${day.description}</p>
              </div>`
          )
          .join('')
      : '<p style="color:#999; font-style:italic;">No detailed itinerary available for this tour.</p>';

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${tour.title} — Itinerary | Andi Tours</title>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Raleway', sans-serif; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #556B2F, #6B8E23); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
          .header h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; }
          .header .meta { display: flex; justify-content: center; gap: 30px; font-size: 0.95rem; opacity: 0.9; }
          .section { margin-bottom: 30px; }
          .section h2 { font-size: 1.3rem; color: #556B2F; border-bottom: 2px solid #6B8E23; padding-bottom: 8px; margin-bottom: 16px; }
          .description { line-height: 1.7; color: #555; margin-bottom: 25px; }
          .footer-print { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #999; font-size: 0.85rem; }
          .footer-print strong { color: #556B2F; }
          @media print {
            body { padding: 20px; }
            .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${tour.title}</h1>
          <div class="meta">
            <span>⏱ ${tour.duration}</span>
          </div>
        </div>

        ${tour.description ? `
          <div class="section">
            <h2>About This Tour</h2>
            <p class="description">${tour.description}</p>
          </div>
        ` : ''}

        ${tour.highlights ? `
          <div class="section">
            <h2>Tour Highlights</h2>
            <p class="description">${tour.highlights}</p>
          </div>
        ` : ''}

        <div class="section">
          <h2>Day-by-Day Itinerary</h2>
          ${itineraryDays}
        </div>

        ${tour.travelDetails ? `
          <div class="section">
            <h2>Travel Details</h2>
            <p class="description">${tour.travelDetails}</p>
          </div>
        ` : ''}

        <div class="footer-print">
          <p>Prepared by <strong>Andi Tours</strong> — Ethiopia's Premier Travel Experience</p>
          <p>📧 dobitoursethiopia@gmail.com &nbsp; 📞 +251 911 661 377</p>
          <p style="margin-top:8px; font-size:0.78rem;">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      // Small delay for fonts to load
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <button
      type="button"
      className="print-itinerary-btn"
      onClick={handlePrint}
      title="Print or save itinerary as PDF"
    >
      🖨️ Print Itinerary
      <style>{`
        .print-itinerary-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(85, 107, 47, 0.15);
          color: #556B2F;
          border: 1px solid rgba(85, 107, 47, 0.3);
          padding: 10px 20px;
          border-radius: 8px;
          font-family: 'Raleway', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 12px;
        }
        .print-itinerary-btn:hover {
          background: #556B2F;
          color: white;
          border-color: #556B2F;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(85, 107, 47, 0.3);
        }
        @media print {
          .print-itinerary-btn { display: none !important; }
        }
      `}</style>
    </button>
  );
}

export default PrintItineraryButton;
