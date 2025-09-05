// Create an item in the context menu
browser.menus.create({
  id: "copy-message-details",
  title: "Copy email data",
  contexts: ["message_list"] // Only appears in the list of emails
});

// message handling function - copying data to the clipboard
async function email_headers_to_buffer (tab) {
  const messages = await browser.messageDisplay.getDisplayedMessages(tab.id);
  const message = messages[0]; // We take the first selected letter
  if (message) {
    // Get full email headers
    const fullMessage = await browser.messages.get(message.id);
    // Format the date in the local format
    const date = new Date(fullMessage.date);
    const formattedDate = date.toLocaleString(); // Date and time in the system format
    // Extract recipients (there may be several)
    const recipients = fullMessage.recipients.map(addr => addr.email).join(', ');
    // Form text to be copied
    const textToCopy = 
      `Subject: ${fullMessage.subject}\n` +
      `From: ${fullMessage.author}\n` +
      `To: ${fullMessage.recipients}\n` +
      `Date: ${formattedDate}`;
    // Copy the text to the clipboard
    try {
      // Use modern Clipboard API (available in WebExtensions)
      await navigator.clipboard.writeText(textToCopy);
      console.log("Copy Message Details: The data has been copied to the clipboard");
    } catch (err) {
      // Fallback for older versions (although this is unlikely to be needed in 128.ESR)
      console.error("Copy Message Details: Clipboard copy error: ", err);
    }
  }

}

// Fallback for older versions (although this is unlikely to be needed in 128.ESR)
browser.menus.onClicked.addListener(async (info, tab) => {
 console.log("Copy Message Details: Обработка пункта меню ");
 email_headers_to_buffer (tab);
});

// Handle button click
browser.browserAction.onClicked.addListener(async (info, tab) => {
  console.log("Copy Message Details:  Обработка нажатия кнопки ");
  email_headers_to_buffer (tab);

});

// Handle shortcut Ctrl+Shift+S
browser.commands.onCommand.addListener(async (command, tab) => {
  console.log("Copy Message Details:  Обработка shortcut Ctrl+Shift+S");
  email_headers_to_buffer (tab);
});