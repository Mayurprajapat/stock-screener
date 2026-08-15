#!/usr/bin/env python3
import sys
sys.path.insert(0, r'C:\Program Files\Python314')

try:
    import PyPDF2
    pdf_path = r'c:\Users\DAEREK\stock-screener\493559A_Front-End-Developer_Real_Time_Stock_Screener.pdf'
    
    with open(pdf_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        print(f"Total pages: {len(pdf.pages)}\n")
        
        # Extract all pages
        full_text = ""
        for i, page in enumerate(pdf.pages):
            print(f"\n{'='*80}")
            print(f"PAGE {i+1} OF {len(pdf.pages)}")
            print(f"{'='*80}\n")
            text = page.extract_text()
            print(text)
            full_text += text + "\n\n"
            
        # Save to file
        with open(r'c:\Users\DAEREK\stock-screener\PDF_CONTENT.txt', 'w', encoding='utf-8') as f:
            f.write(full_text)
        print("\n\n✅ PDF content saved to PDF_CONTENT.txt")
            
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
