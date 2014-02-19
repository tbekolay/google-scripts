function getContactsWithBirthdays() {
  var contacts = ContactsApp.getContacts();
  //Logger.log("Before: " + contacts.length);
  
  for (var i = contacts.length - 1; i >= 0; i--) {
    if (contacts[i].getDates(ContactsApp.Field.BIRTHDAY).length > 0) {
      //Logger.log(contacts[i].getDates(ContactsApp.Field.BIRTHDAY)[0].getYear());
      contacts.splice(i, 1);
    }
  }
  
  //Logger.log("After: " + contacts.length);
  return contacts;
}

function getNameAndEmail(contact) {
  return contact.getFullName() + " <" + contact.getPrimaryEmail() + ">"
}

function removeBirthdayFromContact(e) {
  var contactId = e.parameter.hidden_tag;
  var contact = ContactsApp.getContactById(contactId);
  var birthdays = contact.getDates(ContactsApp.Field.BIRTHDAY);
  if (birthdays.length > 0) {
    birthdays[0].deleteDateField();
    Logger.log("Deleted birthday from " + getNameAndEmail(contact));
  }
}

function createGUI() {
  var contacts = ContactsApp.getContacts();
  var app = UiApp.createApplication();
  var panel = app.createVerticalPanel();
  app.add(app.createLabel("People with birthdays in their contact info")
          .setStyleAttribute("fontWeight", "bold")
          .setStyleAttribute("fontSize", "20"));

  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].getDates(ContactsApp.Field.BIRTHDAY).length > 0) {
      var label = app.createLabel(getNameAndEmail(contacts[i]));
      var button = app.createButton("Remove birthday");
      var hidden = app.createHidden("hidden")
        .setTag(contacts[i].getId());
      panel.add(app.createHorizontalPanel()
          .setVerticalAlignment(UiApp.VerticalAlignment.MIDDLE)
          .add(hidden)
          .add(label)
          .add(button));
      button.addClickHandler(app.createServerHandler()
        .addCallbackElement(hidden)
        .setCallbackFunction("removeBirthdayFromContact"));
      button.addClickHandler(app.createClientHandler()
        .forTargets(label, button)
        .setEnabled(false)
        .setVisible(false));
    }
  }
  
  app.add(panel);
  return app;
}

function doGet() {
  return createGUI();
}
