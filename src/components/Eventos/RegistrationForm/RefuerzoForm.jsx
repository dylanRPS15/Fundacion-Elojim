"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormSubmit } from "@/hooks/useFormSubmit"; // Importa el hook
import { FormSection } from "../form-components/FormSection";
import { PersonalInfoFields } from "../form-components/PersonalInfoFields";
import { RadioOptions } from "../form-components/RadioOptions";
import { CheckboxGroup } from "../form-components/CheckboxGroup";
import { TermsCheckbox } from "../form-components/TermsCheckbox";
import { FormButtons } from "../form-components/FormButtons";

export default function RefuerzoForm({ program, onClose }) {
  const [formData, setFormData] = useState({
    // Datos del Niño/a
    nombreCompleto: "",
    fechaNacimiento: "",
    comuna: "",
    estratoSocial: "",
    edad: "",
    grupoEtnico: "",
    institucionEducativa: "",
    cursoGrado: "",
    direccion: "",

    // Datos del Acudiente
    nombreAcudiente: "",
    relacionNino: "",
    telefonoContacto: "",
    correoElectronico: "",

    // Información Académica
    areasAyuda: [],
    otrasAreas: "",
    refuerzoPrevio: false, // Cambiado a booleano para consistencia con RadioOptions
    dificultadesAcademicas: "",

    // Disponibilidad y Recursos
    disponibilidad: "",
    accesoMateriales: false, // Cambiado a booleano
    apoyoHabitos: false, // Cambiado a booleano

    // Motivación
    motivacion: "",
    expectativas: "",

    // Autorización
    aceptaTerminos: false,
  });

  // Utiliza el hook useFormSubmit
  const { isSubmitting, handleSubmit } = useFormSubmit({
    programId: "refuerzo-escolar", // <--- ¡Importante! Nuevo programId
    onSuccess: onClose,
    successDescription: `Has inscrito correctamente al niño/a en el programa ${program.title}.`,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (name, value) => {
    // Asegurarse de que el valor sea un booleano si la opción de RadioOptions lo devuelve como string
    setFormData({
      ...formData,
      [name]: typeof value === "string" ? value === "true" : value,
    });
  };

  const handleAreaChange = (newValues) => {
    setFormData({
      ...formData,
      areasAyuda: newValues,
    });
  };

  const areasAyuda = [
    "Matemáticas",
    "Lectura y comprensión",
    "Escritura",
    "Ciencias naturales",
    "Inglés",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6">
      <div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: program.color }}>
          Formulario de Registro - Jornadas de Refuerzo
        </h3>
        <p className="text-gray-600 mb-6">
          Complete el siguiente formulario para inscribir al niño, niña o
          adolescente en las jornadas de refuerzo.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // Previene la recarga de la página
          handleSubmit(formData); // Llama al handleSubmit del hook, pasándole formData
        }}
        className="space-y-6">
        <FormSection
          title="Datos del Niño, Niña o Adolescente"
          color={program.color}>
          {/* Aquí se asume que PersonalInfoFields maneja el cambio de formData correctamente internamente.
              Si PersonalInfoFields necesita un onChange específico para sus campos, asegúrate de pasárselo.
              Para este formulario, 'nombreCompleto', 'fechaNacimiento', 'comuna', 'estratoSocial', 'edad', 'grupoEtnico'
              están en formData.
          */}
          <PersonalInfoFields formData={formData} onChange={setFormData} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="institucionEducativa">
                Institución educativa<span className="text-red-500">*</span>
              </Label>
              <Input
                id="institucionEducativa"
                name="institucionEducativa"
                value={formData.institucionEducativa}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cursoGrado">
                Curso/Grado<span className="text-red-500">*</span>
              </Label>
              <Input
                id="cursoGrado"
                name="cursoGrado"
                value={formData.cursoGrado}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Datos del Acudiente" color={program.color}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="nombreAcudiente">
                Nombre completo<span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombreAcudiente"
                name="nombreAcudiente"
                value={formData.nombreAcudiente}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relacionNino">
                Relación con el niño/a<span className="text-red-500">*</span>
              </Label>
              <Input
                id="relacionNino"
                name="relacionNino"
                value={formData.relacionNino}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefonoContacto">
                Teléfono de contacto<span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefonoContacto"
                name="telefonoContacto"
                value={formData.telefonoContacto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correoElectronico">
                Correo electrónico<span className="text-red-500">*</span>
              </Label>
              <Input
                id="correoElectronico"
                name="correoElectronico"
                type="email"
                value={formData.correoElectronico}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Información Académica y Necesidades de Refuerzo"
          color={program.color}>
          <div className="space-y-4">
            <CheckboxGroup
              label="¿En qué áreas necesita apoyo el niño/a? (Marcar las que apliquen):"
              options={areasAyuda}
              selectedValues={formData.areasAyuda}
              onChange={handleAreaChange}
              columns={2}
              showOtherOption={true}
              otherOptionLabel="Otras"
              otherValue={formData.otrasAreas}
              onOtherValueChange={(value) =>
                setFormData({ ...formData, otrasAreas: value })
              }
              required // Puede que quieras que esto sea opcional si no se marcan áreas
            />

            <RadioOptions
              label="¿Ha recibido refuerzo escolar anteriormente?"
              name="refuerzoPrevio"
              value={formData.refuerzoPrevio}
              onChange={handleRadioChange}
              required
            />

            <div className="space-y-2">
              <Label htmlFor="dificultadesAcademicas">
                ¿Cuáles considera que son las principales dificultades
                académicas del niño/a?
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="dificultadesAcademicas"
                name="dificultadesAcademicas"
                value={formData.dificultadesAcademicas}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Disponibilidad y Acceso a Recursos"
          color={program.color}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disponibilidad">
                Días y horarios disponibles
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="disponibilidad"
                name="disponibilidad"
                value={formData.disponibilidad}
                onChange={handleChange}
                placeholder="Ej: Lunes y miércoles de 3pm a 5pm"
                required
              />
            </div>

            <RadioOptions
              label="¿Cuenta con acceso a materiales escolares básicos en casa?"
              name="accesoMateriales"
              value={formData.accesoMateriales}
              onChange={handleRadioChange}
              required
            />

            <RadioOptions
              label="¿Requiere apoyo en hábitos de estudio y organización del tiempo?"
              name="apoyoHabitos"
              value={formData.apoyoHabitos}
              onChange={handleRadioChange}
              required
            />
          </div>
        </FormSection>

        <FormSection title="Motivación y Expectativas" color={program.color}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivacion">
                ¿Por qué desea que el niño/a participe en las jornadas de
                refuerzo?
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivacion"
                name="motivacion"
                value={formData.motivacion}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectativas">
                ¿Cuáles son sus expectativas respecto al programa?
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="expectativas"
                name="expectativas"
                value={formData.expectativas}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Autorización de Participación y Tratamiento de Datos"
          color={program.color}>
          <TermsCheckbox
            checked={formData.aceptaTerminos}
            onChange={(checked) =>
              setFormData({ ...formData, aceptaTerminos: checked })
            }
            text="Autorizo la participación del niño/a en las jornadas de refuerzo escolar y el uso de sus datos personales para efectos de gestión, comunicación y participación en las actividades del programa, según la Ley 1581 de 2012."
          />
        </FormSection>

        <FormButtons
          onCancel={onClose}
          isSubmitting={isSubmitting} // isSubmitting viene del hook
          submitColor={program.color}
        />
      </form>
    </motion.div>
  );
}
