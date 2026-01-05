/**
 * User data interface for email template variables
 */
export interface UserData {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
  isOnboarded: boolean;
  credits: number;
  stripeCustomerId?: string;
  plan: string;
  isOverDue: boolean;
  planExpiringAt?: Date;
}

/**
 * Replaces template variables in email body content with actual user data
 * @param emailBodyContent - The raw HTML body content with variables like {{name}}, {{email}}, etc.
 * @param userData - User data object containing values to replace variables
 * @returns HTML content with variables replaced
 */
export function replaceEmailVariables(emailBodyContent: string, userData: UserData): string {
  let processedContent = emailBodyContent;

  // Replace all template variables with actual user data
  processedContent = processedContent.replace(/\{\{id\}\}/g, userData.id?.toString() || '');
  processedContent = processedContent.replace(/\{\{name\}\}/g, userData.name || '');
  processedContent = processedContent.replace(/\{\{email\}\}/g, userData.email || '');
  processedContent = processedContent.replace(
    /\{\{profilePicture\}\}/g,
    userData.profilePicture || ''
  );
  processedContent = processedContent.replace(/\{\{role\}\}/g, userData.role || '');
  processedContent = processedContent.replace(
    /\{\{isOnboarded\}\}/g,
    userData.isOnboarded ? 'Yes' : 'No'
  );
  processedContent = processedContent.replace(
    /\{\{credits\}\}/g,
    userData.credits?.toString() || '0'
  );
  processedContent = processedContent.replace(
    /\{\{stripeCustomerId\}\}/g,
    userData.stripeCustomerId || ''
  );
  processedContent = processedContent.replace(/\{\{plan\}\}/g, userData.plan || '');
  processedContent = processedContent.replace(
    /\{\{isOverDue\}\}/g,
    userData.isOverDue ? 'Yes' : 'No'
  );
  processedContent = processedContent.replace(
    /\{\{planExpiringAt\}\}/g,
    userData.planExpiringAt ? userData.planExpiringAt.toLocaleDateString() : ''
  );

  return processedContent;
}

/**
 * Generates a complete HTML email document from raw body content with user data
 * @param emailBodyContent - The raw HTML body content from the email template
 * @param userData - User data object for variable replacement
 * @returns Complete HTML document string with variables replaced
 */
export function generateEmailHtmlWithUserData(
  emailBodyContent: string,
  userData: UserData
): string {
  // First replace variables in the body content
  const processedBodyContent = replaceEmailVariables(emailBodyContent, userData);

  // Then generate the complete HTML document
  return generateEmailHtml(processedBodyContent);
}

/**
 * Generates a complete HTML email document from raw body content
 * @param emailBodyContent - The raw HTML body content from the email template
 * @returns Complete HTML document string
 */
export function generateEmailHtml(emailBodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email</title>
  <style>
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
    }
    
    /* Remove blue links for clients that don't support them */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    
    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      min-width: 100%;
      height: 100%;
      background-color: #f4f4f4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
    }
    
    /* Email container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    /* Responsive design */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${emailBodyContent}
  </div>
</body>
</html>`;
}

/**
 * Validates if the provided string is valid HTML
 * @param html - HTML string to validate
 * @returns boolean indicating if HTML is valid
 */
export function isValidHtml(html: string): boolean {
  try {
    // Basic HTML validation - check for proper opening and closing tags
    // Simple validation - this could be enhanced with a proper HTML parser
    return html.includes('<') && html.includes('>');
  } catch (_error) {
    return false;
  }
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
}
