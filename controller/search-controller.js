import {  Contact } from "../model/contacts.js";
import User from "../model/user.js";



const searchByName = async (req, res) => {
  try {
    const searchQuery = req.query.name;
    if (!searchQuery) {
      return res.status(400).json({ msg: 'Enter Valid Name' });
    }

    // Search by name
    const nameResults = await Contact.find({ name: { $regex: new RegExp('^' + searchQuery, 'i') } })
      .select('name phone_number spamReports')
      .sort({ name: 1 }); // Sort results alphabetically by name

    // Also, search for names containing the query but not starting with it
    const additionalResults = await Contact.find({ name: { $regex: new RegExp(searchQuery, 'i'), $not: new RegExp('^' + searchQuery, 'i') } })
      .select('name phone_number spamReports')
      .sort({ name: 1 });

    // Combine and return the results
    const allResults = nameResults.concat(additionalResults);
    return res.status(200).json({ nameResults: allResults });
  } catch (error) {
    return res.status(500).json({ msg: 'Error while searching by name' });
  }
};

const searchByPhoneNumber = async (req, res) => {
  try {
    const phoneNumber = req.query.phone_number;
    if (!phoneNumber || isNaN(phoneNumber)) {
      return res.status(400).json({ msg: 'Enter Valid phone Number' });
    }

    // Search in User Database
    const userResult = await User.findOne({ phone_number: phoneNumber }).select('name phone_number spamReports email');
    if (userResult) {
      // If a registered user is found, return only that result
      return res.status(200).json({ result: [userResult] });
    }

    // If not found in User Database, search in global database
    const globalResults = await Contact.find({ phone_number: phoneNumber })
      .select('name phone_number spamReports');

    return res.status(200).json({ result: globalResults });
  } catch (error) {
    console.error('Error while searching by phone number', error);
    return res.status(500).json({ msg: 'Error while searching by phone number' });
  }
};

export { searchByName ,searchByPhoneNumber};