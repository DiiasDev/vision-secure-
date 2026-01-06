import React, { useState, useEffect, useMemo } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { Upload, X } from "lucide-react";

type Field = {
  fieldname: string;
  label: string;
  fieldtype: string;
  required?: boolean;
  options?: string[] | string;
  section?: string;
  placeholder?: string;
  defaultValue?: string;
  fullWidth?: boolean;
};

type FormComponentProps = {
  campos: Field[];
  titulo: string;
  subtitulo?: string;
  onSubmit?: (data: any) => void;
  submitButtonText?: string;
  initialData?: Record<string, any>;
};

const FormComponent: React.FC<FormComponentProps> = ({
  campos,
  titulo,
  subtitulo,
  onSubmit,
  submitButtonText = "Salvar",
  initialData = {},
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Inicializar tema na montagem do componente
  useEffect(() => {
    setIsDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  // Observar mudanças no dark mode
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Tema MUI customizado - recriado quando isDarkMode muda
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: isDarkMode ? "#60a5fa" : "#3b82f6",
            light: "#60a5fa",
            dark: "#1d4ed8",
          },
          background: {
            paper: isDarkMode ? "#1e293b" : "#ffffff",
            default: isDarkMode ? "#0f172a" : "#f9fafb",
          },
          text: {
            primary: isDarkMode ? "#f8fafc" : "#1f2937",
            secondary: isDarkMode ? "#cbd5e1" : "#6b7280",
          },
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
                color: isDarkMode ? "#f8fafc" : "#1f2937",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.3)",
                },
                "&.Mui-focused": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "#60a5fa" : "#1d4ed8",
                  borderWidth: "2px",
                },
              },
              notchedOutline: {
                borderColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.23)",
              },
              input: {
                color: isDarkMode ? "#f8fafc" : "#1f2937",
                "&::placeholder": {
                  color: isDarkMode ? "#94a3b8" : "#6b7280",
                  opacity: 1,
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: isDarkMode ? "#cbd5e1" : "#6b7280",
                "&.Mui-focused": {
                  color: isDarkMode ? "#60a5fa" : "#1d4ed8",
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              select: {
                color: isDarkMode ? "#f8fafc" : "#1f2937",
              },
              icon: {
                color: isDarkMode ? "#cbd5e1" : "#6b7280",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: isDarkMode ? "#f8fafc !important" : "#1f2937 !important",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(59, 130, 246, 0.15) !important"
                    : "rgba(29, 78, 216, 0.08) !important",
                },
                "&.Mui-selected": {
                  backgroundColor: isDarkMode
                    ? "rgba(59, 130, 246, 0.2) !important"
                    : "rgba(29, 78, 216, 0.12) !important",
                  color: isDarkMode ? "#ffffff !important" : "#1f2937 !important",
                  "&:hover": {
                    backgroundColor: isDarkMode
                      ? "rgba(59, 130, 246, 0.25) !important"
                      : "rgba(29, 78, 216, 0.16) !important",
                  },
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                backgroundImage: "none",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: isDarkMode ? "#cbd5e1 !important" : "#6b7280 !important",
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
                },
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  // Controle centralizado de mudança de valores
  const handleChange = (fieldname: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldname]: value }));
  };

  // Manipular upload de imagem
  const handleImageUpload = (
    fieldname: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        handleChange(fieldname, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remover imagem
  const handleRemoveImage = (fieldname: string) => {
    setImagePreview(null);
    handleChange(fieldname, null);
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      setLoading(true);
      try {
        await onSubmit(formData);
        setFormData({}); // Limpar formulário após sucesso
      } catch (error) {
        // Erro será tratado pelo componente pai
      } finally {
        setLoading(false);
      }
    }
  };

  // Renderização dinâmica por tipo
  const renderField = (field: Field) => {
    const value = formData[field.fieldname] || field.defaultValue || "";

    switch (field.fieldtype) {
      case "Select":
        const options = Array.isArray(field.options)
          ? field.options
          : String(field.options || "")
              .split("\n")
              .filter(Boolean);

        return (
          <FormControl fullWidth size="small">
            <Select
              value={value}
              onChange={(e) => handleChange(field.fieldname, e.target.value)}
              displayEmpty
              required={field.required}
              sx={{
                color: isDarkMode ? "#f8fafc !important" : "#1f2937 !important",
                "& .MuiSelect-select": {
                  color: isDarkMode ? "#f8fafc !important" : "#1f2937 !important",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: isDarkMode ? "#1e293b" : "#ffffff",
                    maxHeight: 300,
                    boxShadow: isDarkMode
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    border: isDarkMode ? "1px solid #334155" : "1px solid #e5e7eb",
                    "& .MuiList-root": {
                      padding: "8px",
                      bgcolor: isDarkMode ? "#1e293b" : "#ffffff",
                    },
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                <span
                  style={{
                    color: isDarkMode ? "#94a3b8 !important" : "#6b7280 !important",
                    fontStyle: "italic",
                  }}
                >
                  Selecione...
                </span>
              </MenuItem>
              {options.map((opt) => (
                <MenuItem
                  key={opt}
                  value={opt}
                  sx={{
                    borderRadius: "6px",
                    marginBottom: "2px",
                  }}
                >
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "Check":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) =>
                  handleChange(field.fieldname, e.target.checked ? 1 : 0)
                }
                sx={{
                  color: isDarkMode ? "#94a3b8" : "#6b7280",
                  "&.Mui-checked": {
                    color: isDarkMode ? "#60a5fa" : "#1d4ed8",
                  },
                }}
              />
            }
            label=""
          />
        );

      case "Small Text":
      case "textarea":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            value={value}
            required={field.required}
            onChange={(e) => handleChange(field.fieldname, e.target.value)}
            variant="outlined"
            size="small"
            placeholder={field.placeholder}
          />
        );

      case "Int":
      case "Float":
      case "number":
        return (
          <TextField
            fullWidth
            type="number"
            value={value}
            required={field.required}
            onChange={(e) => handleChange(field.fieldname, e.target.value)}
            variant="outlined"
            size="small"
            placeholder={field.placeholder}
            inputProps={{
              step: field.fieldtype === "Float" ? "0.01" : "1",
            }}
          />
        );

      case "Date":
        return (
          <LocalizationProvider 
            dateAdapter={AdapterDayjs} 
            adapterLocale="pt-br"
            localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <DatePicker
              value={value ? dayjs(value) : null}
              onChange={(newValue: Dayjs | null) => {
                handleChange(
                  field.fieldname,
                  newValue ? newValue.format("YYYY-MM-DD") : ""
                );
              }}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  required: field.required,
                  variant: "outlined",
                  placeholder: field.placeholder,
                },
                actionBar: {
                  actions: ["clear", "today", "accept"],
                },
                popper: {
                  sx: {
                    "& .MuiPaper-root": {
                      backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                      boxShadow: isDarkMode
                        ? "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      border: isDarkMode ? "1px solid #334155" : "1px solid #e5e7eb",
                    },
                    "& .MuiPickersDay-root": {
                      color: isDarkMode ? "#f8fafc" : "#1f2937",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(29, 78, 216, 0.08)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: isDarkMode
                          ? "#3b82f6 !important"
                          : "#1d4ed8 !important",
                        color: "#ffffff !important",
                        "&:hover": {
                          backgroundColor: isDarkMode
                            ? "#2563eb !important"
                            : "#1e40af !important",
                        },
                      },
                    },
                    "& .MuiPickersCalendarHeader-root": {
                      color: isDarkMode ? "#f8fafc" : "#1f2937",
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: isDarkMode ? "#f8fafc" : "#1f2937",
                      fontWeight: 500,
                    },
                    "& .MuiPickersCalendarHeader-switchViewButton": {
                      color: isDarkMode ? "#f8fafc" : "#1f2937",
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      color: isDarkMode ? "#94a3b8" : "#6b7280",
                      fontWeight: 600,
                    },
                    "& .MuiPickersYear-yearButton": {
                      color: isDarkMode ? "#f8fafc" : "#1f2937",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(29, 78, 216, 0.08)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: isDarkMode
                          ? "#3b82f6 !important"
                          : "#1d4ed8 !important",
                        color: "#ffffff !important",
                      },
                    },
                    "& .MuiPickersMonth-monthButton": {
                      color: isDarkMode ? "#f8fafc" : "#1f2937",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(29, 78, 216, 0.08)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: isDarkMode
                          ? "#3b82f6 !important"
                          : "#1d4ed8 !important",
                        color: "#ffffff !important",
                      },
                    },
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                },
              }}
            />
          </LocalizationProvider>
        );

      case "Attach Image":
        return (
          <Box className="flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              id={`upload-${field.fieldname}`}
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(field.fieldname, e)}
            />

            {imagePreview || value ? (
              <Box className="relative inline-block">
                <Avatar
                  src={imagePreview || value}
                  alt="Preview"
                  sx={{
                    width: 120,
                    height: 120,
                    border: isDarkMode ? "3px solid #334155" : "3px solid #e5e7eb",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(field.fieldname)}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: isDarkMode ? "#ef4444" : "#dc2626",
                    color: "white",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#dc2626" : "#b91c1c",
                    },
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Box>
            ) : (
              <label htmlFor={`upload-${field.fieldname}`}>
                <Box
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  sx={{
                    borderColor: isDarkMode ? "#334155" : "#d1d5db",
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                    "&:hover": {
                      borderColor: isDarkMode ? "#60a5fa" : "#3b82f6",
                      backgroundColor: isDarkMode
                        ? "rgba(59, 130, 246, 0.05)"
                        : "rgba(59, 130, 246, 0.05)",
                    },
                  }}
                >
                  <Upload
                    size={32}
                    className="mx-auto mb-2"
                    style={{ color: isDarkMode ? "#94a3b8" : "#6b7280" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: isDarkMode ? "#94a3b8" : "#6b7280" }}
                  >
                    Clique para fazer upload da imagem
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: isDarkMode ? "#64748b" : "#9ca3af" }}
                  >
                    PNG, JPG, GIF até 10MB
                  </p>
                </Box>
              </label>
            )}
          </Box>
        );

      default:
        return (
          <TextField
            fullWidth
            type={field.fieldtype === "email" ? "email" : field.fieldtype === "tel" ? "tel" : field.fieldtype === "password" ? "password" : "text"}
            value={value}
            required={field.required}
            onChange={(e) => handleChange(field.fieldname, e.target.value)}
            variant="outlined"
            size="small"
            placeholder={field.placeholder}
          />
        );
    }
  };

  // Agrupar campos por seção
  const groupedFields = campos.reduce((acc, field) => {
    const section = field.section || "Geral";
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {} as Record<string, Field[]>);

  return (
    <ThemeProvider theme={muiTheme}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl mx-auto p-8"
      >
        <div className="bg-[var(--bg-card)] rounded-2xl p-8 shadow-[var(--shadow-md)] border border-[var(--border-default)]">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {titulo}
            </h1>
            {subtitulo && (
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                {subtitulo}
              </p>
            )}
          </div>

          {/* Seções de campos */}
          <div className="space-y-8">
            {Object.entries(groupedFields).map(([section, sectionFields]) => (
              <div key={section} className="space-y-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] pb-2 border-b-2 border-[var(--border-default)]">
                  {section}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectionFields.map((field) => (
                    <div
                      key={field.fieldname}
                      className={`flex flex-col gap-2 ${
                        field.fullWidth || field.fieldtype === "Small Text" || field.fieldtype === "textarea"
                          ? "lg:col-span-3 md:col-span-2"
                          : ""
                      }`}
                    >
                      <label className="block text-sm font-semibold text-[var(--text-primary)]">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Botão de submit */}
          <div className="mt-8 pt-6 border-t border-[var(--border-default)]">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : submitButtonText}
            </button>
          </div>
        </div>
      </form>
    </ThemeProvider>
  );
};

export default FormComponent;

