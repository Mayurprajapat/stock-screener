#!/usr/bin/env python3
try:
    import PyPDF2
    pdf_path = r'c:\Users\DAEREK\stock-screener\493559A_Front-End-Developer_Real_Time_Stock_Screener.pdf'
    
    with open(pdf_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        print(f"Total pages: {len(pdf.pages)}\n")
        
        # Extract first 3 pages
        for i, page in enumerate(pdf.pages[:3]):
            print(f"\n{'='*60}")
            print(f"PAGE {i+1}")
            print(f"{'='*60}\n")
            text = page.extract_text()
            print(text)
            
except ImportError:
    print("PyPDF2 not installed. Trying alternative method...")
    try:
        import pdfplumber
        pdf_path = r'c:\Users\DAEREK\stock-screener\493559A_Front-End-Developer_Real_Time_Stock_Screener.pdf'
        
        with pdfplumber.open(pdf_path) as pdf:
            print(f"Total pages: {len(pdf.pages)}\n")
            
            for i, page in enumerate(pdf.pages[:3]):
                print(f"\n{'='*60}")
                print(f"PAGE {i+1}")
                print(f"{'='*60}\n")
                text = page.extract_text()
                print(text)
    except ImportError:
        print("pdfplumber not installed either.")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
