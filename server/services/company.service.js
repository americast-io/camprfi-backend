const { Company } = require('../models/company.model');

const createCompany = async (data) => {
    const company = await Company.create(data);
    return company;
};

const getAllCompanies = async () => {
    const companies = await Company.find();
    return companies;
};

const getCompanyById = async (id) => {
    const company = await Company.findById(id);
    return company;
};

const deleteCompanyById = async (id) => {
    const company = await Company.findByIdAndDelete(id);
    return company;
};

const updateCompanyById = async (id, data) => {
    const company = Company.findByIdAndUpdate(id, data, {
        runValidators: true,
        new: true,
    });
    return company;
};

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    deleteCompanyById,
    updateCompanyById,
};

