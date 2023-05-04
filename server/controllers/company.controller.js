const ErrorHandler = require('../utils/errorHandler');

const {
    createCompany,
    getAllCompanies,
    getCompanyById,
    deleteCompanyById,
    updateCompanyById,

} = require('../services/company.service');

const handleCreateCompany = async (req, res) => {

    req.body.user = req.user.id;

    try {
        const company = await createCompany(req.body);
        return res.status(201).json(company);
    }catch (error) {
        return res.status(400).json(error);
    }
};

const handleGetAllCompanies = async (req, res) => {
    try{
        const companies = await getAllCompanies();
        return res.status(200).json(companies)
    }catch (error){
        return res.status(400).json(companies);
    }
};

const handleGetCompanyById = async (req, res) => {
    try{
        const company = await getCompanyById(req.params.id);
        return res.status(200).json(company);
    }catch (error) {
        return res.status(400).json(error)
    }
};

const handleDeleteCompanyById = async (req, res) => {
    try{
        const company = await deleteCompanyById(req.params.id);
        return res.status(200).json(company)
    }catch (error) {
        return res.status(400).json(error)
    }
};

const handleUpdateCompanyById = async (req, res) => {
    try{
        const company = await updateCompanyById(req.params.id, req.body);
        return res.status(200).json(company);
    }catch (error) {
        res.status(400).json(error);
    }
}

module.exports = {
    handleCreateCompany,
    handleGetAllCompanies,
    handleGetCompanyById,
    handleDeleteCompanyById,
    handleUpdateCompanyById,
}

