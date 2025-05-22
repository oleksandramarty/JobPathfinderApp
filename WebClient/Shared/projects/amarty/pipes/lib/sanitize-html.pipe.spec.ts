import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml, BrowserModule } from '@angular/platform-browser'; // Import BrowserModule to get DomSanitizer
import { SecurityContext } from '@angular/core'; 

import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
  let pipe: SanitizeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule], // BrowserModule provides DomSanitizer
      providers: [
        SanitizeHtmlPipe,
        // DomSanitizer is provided by BrowserModule
      ]
    });
    pipe = TestBed.inject(SanitizeHtmlPipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string when value is undefined', () => {
    // The pipe itself returns '', which is then considered safe by Angular if bound to innerHTML.
    // bypassSecurityTrustHtml('') results in a SafeHtml object representing an empty string.
    const safeValue = pipe.transform(undefined);
    expect(safeValue.toString()).toBe(''); // SafeHtml object for empty string
  });

  it('should return an empty string (as SafeHtml) when value is an empty string', () => {
    const safeValue = pipe.transform('');
    // Check by trying to sanitize it back or by inspecting its string representation
    expect(sanitizer.sanitize(SecurityContext.HTML, safeValue)).toBe('');
  });

  it('should bypass security and trust simple HTML', () => {
    const html = '<p>Hello World</p>';
    const safeValue = pipe.transform(html);
    expect(safeValue).toBeTruthy();
    // To check the actual value, sanitize it with a restrictive context or check its string form
    // Here, we expect bypassSecurityTrustHtml to preserve the HTML.
    expect(sanitizer.sanitize(SecurityContext.HTML, safeValue)).toEqual(html);
  });

  it('should bypass security and trust HTML with attributes', () => {
    const html = '<div class="test" id="myDiv">Content</div>';
    const safeValue = pipe.transform(html);
    expect(sanitizer.sanitize(SecurityContext.HTML, safeValue)).toEqual(html);
  });

  it('should bypass security even for HTML containing a <script> tag', () => {
    const htmlWithScript = '<p>Test</p><script>alert("hacked")</script>';
    const safeValue = pipe.transform(htmlWithScript);
    // bypassSecurityTrustHtml means the script tag is preserved in the SafeHtml object.
    // When rendered, it would execute (which is the point of bypassing security).
    // sanitize(HTML) will actually remove the script tag for safety if it's configured to do so.
    // So this test needs to be careful. The pipe's job is to return SafeHtml that *allows* the script.
    // A good way to test is to check the string value held by SafeHtml if possible, or trust the bypass.
    // For this test, we'll check what `bypassSecurityTrustHtml` does.
    // The actual string value might be hard to get directly from SafeHtml without internal Angular APIs.
    // A common check is simply that it's not null and is a SafeHtml instance.
    expect(safeValue).toBeTruthy();
    // If we use sanitizer.sanitize(SecurityContext.HTML, safeValue), it will strip the script.
    // This means the pipe correctly created a SafeHtml object that *would* render the script.
    // So, we test the *output* of the pipe, not the *effect* of rendering it in a safe context.
    // The value held by SafeHtmlImpl is usually checked by its 'changingThisBreaksApplicationSecurity' property.
    expect(safeValue.toString()).toContain('<script>alert("hacked")</script>');
  });
  
  it('should return a SafeHtml object', () => {
    const html = '<span>Test</span>';
    const safeValue = pipe.transform(html);
    // Check if it's an object that has the specific properties of SafeHtml/SafeValue
    expect(typeof safeValue).toBe('object'); 
    expect(safeValue).toHaveProperty('changingThisBreaksApplicationSecurity'); 
  });
});
