const express = require('express');

const {
    handleCreateCompany,
    handleGetAllCompanies,
    handleGetCompanyById,
    handleDeleteCompanyById,
    handleUpdateCompanyById,

} = require('../controllers/company.controller');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/', handleCreateCompany);
router.get('/', handleGetAllCompanies);
router.get('/:id', handleGetCompanyById);
router.delete('/:id', handleDeleteCompanyById);
router.put('/:id', handleUpdateCompanyById);

module.exports = { companyRouter: router };

