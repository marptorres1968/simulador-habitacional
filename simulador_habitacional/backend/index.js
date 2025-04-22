
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');

app.use(cors());
app.use(express.json());

app.post('/enviar-simulacao', async (req, res) => {
  const data = req.body;
  const html = `<h1>Simulação</h1><pre>${JSON.stringify(data, null, 2)}</pre>`;
  const pdfPath = './simulacao.pdf';

  pdf.create(html).toFile(pdfPath, async (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao gerar PDF' });

    let transporter = nodemailer.createTransport({
      host: 'smtp.seuprovedor.com',
      port: 587,
      secure: false,
      auth: {
        user: 'seu@email.com',
        pass: 'sua-senha',
      },
    });

    let mailOptions = {
      from: 'seu@email.com',
      to: `${data.emailCliente}, marptorres@gmail.com`,
      subject: 'Simulação de Financiamento',
      text: 'Segue em anexo a simulação.',
      attachments: [{ filename: 'simulacao.pdf', path: pdfPath }],
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Simulação enviada com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao enviar email' });
    }
  });
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
