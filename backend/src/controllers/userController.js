const prisma = require('../config/database');
const bcrypt = require('bcrypt');

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profilePhoto: true,
        resumePdf: true,
        // Novos campos demográficos
        birthDate: true,
        gender: true,
        city: true,
        state: true,
        zipCode: true,
        nationality: true,
        maritalStatus: true,
        // Formação
        educationLevel: true,
        course: true,
        fieldOfStudy: true,
        complementaryCourses: true,
        certifications: true,
        // Profissional
        currentProfession: true,
        desiredPosition: true,
        skills: true,
        languages: true,
        salaryExpectation: true,
        availability: true,
        contractType: true,
        unemployedMonths: true,
        totalExperience: true,
        lastEmployer: true,
        lastPosition: true,
        lastEmploymentMonths: true,
        workPreference: true,
        preferredCities: true,
        // Processo
        source: true,
        processStatus: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      name, phone, email, password,
      // Demográficos
      birthDate, gender, city, state, zipCode, nationality, maritalStatus,
      // Formação
      educationLevel, course, fieldOfStudy, complementaryCourses, certifications,
      // Profissional
      currentProfession, desiredPosition, skills, languages,
      salaryExpectation, availability, contractType, unemployedMonths,
      totalExperience, lastEmployer, lastPosition, lastEmploymentMonths,
      workPreference, preferredCities,
      // Processo
      source
    } = req.body;

    const data = {};

    // Dados básicos
    if (name) data.name = name;
    if (phone) data.phone = phone;
    if (email) data.email = email;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    // Demográficos
    if (birthDate !== undefined) data.birthDate = birthDate ? new Date(birthDate) : null;
    if (gender !== undefined) data.gender = gender;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (zipCode !== undefined) data.zipCode = zipCode;
    if (nationality !== undefined) data.nationality = nationality;
    if (maritalStatus !== undefined) data.maritalStatus = maritalStatus;

    // Formação
    if (educationLevel !== undefined) data.educationLevel = educationLevel;
    if (course !== undefined) data.course = course;
    if (fieldOfStudy !== undefined) data.fieldOfStudy = fieldOfStudy;
    if (complementaryCourses !== undefined) data.complementaryCourses = complementaryCourses;
    if (certifications !== undefined) data.certifications = certifications;

    // Profissional
    if (currentProfession !== undefined) data.currentProfession = currentProfession;
    if (desiredPosition !== undefined) data.desiredPosition = desiredPosition;
    if (skills !== undefined) data.skills = skills;
    if (languages !== undefined) data.languages = languages;
    if (salaryExpectation !== undefined) data.salaryExpectation = salaryExpectation ? parseFloat(salaryExpectation) : null;
    if (availability !== undefined) data.availability = availability;
    if (contractType !== undefined) data.contractType = contractType;
    if (unemployedMonths !== undefined) data.unemployedMonths = unemployedMonths ? parseInt(unemployedMonths) : null;
    if (totalExperience !== undefined) data.totalExperience = totalExperience ? parseInt(totalExperience) : null;
    if (lastEmployer !== undefined) data.lastEmployer = lastEmployer;
    if (lastPosition !== undefined) data.lastPosition = lastPosition;
    if (lastEmploymentMonths !== undefined) data.lastEmploymentMonths = lastEmploymentMonths ? parseInt(lastEmploymentMonths) : null;
    if (workPreference !== undefined) data.workPreference = workPreference;
    if (preferredCities !== undefined) data.preferredCities = preferredCities;

    // Processo
    if (source !== undefined) data.source = source;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profilePhoto: true,
        resumePdf: true,
      },
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

// Upload de foto de perfil
exports.uploadPhoto = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: photoUrl },
      select: {
        id: true,
        profilePhoto: true,
      },
    });

    res.json({
      message: 'Foto enviada com sucesso',
      photoUrl: user.profilePhoto,
    });
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da foto' });
  }
};

// Upload de currículo em PDF
exports.uploadResume = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { resumePdf: resumeUrl },
      select: {
        id: true,
        resumePdf: true,
      },
    });

    res.json({
      message: 'Currículo enviado com sucesso',
      resumeUrl: user.resumePdf,
    });
  } catch (error) {
    console.error('Erro ao fazer upload do currículo:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do currículo' });
  }
};

