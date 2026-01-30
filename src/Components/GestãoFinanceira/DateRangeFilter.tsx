import { useState } from 'react';
import { Box, Button, Popover, Typography, Chip, IconButton, useTheme } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarToday, Close } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

interface DateRangeFilterProps {
  onDateRangeChange?: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
}

export default function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'days'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [selectedPreset, setSelectedPreset] = useState<string>('1mes');

  const emitChange = (start: Dayjs | null, end: Dayjs | null) => {
    if (onDateRangeChange && start && end) {
      onDateRangeChange(start, end);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const presets = [
    { label: '1 Mês', value: '1mes', days: 30 },
    { label: '3 Meses', value: '3meses', days: 90 },
    { label: '6 Meses', value: '6meses', days: 180 },
    { label: '1 Ano', value: '1ano', days: 365 },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    const end = dayjs();
    const start = dayjs().subtract(preset.days, 'days');
    setStartDate(start);
    setEndDate(end);
    setSelectedPreset(preset.value);
    emitChange(start, end);
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedPreset('');
    if (onDateRangeChange) {
      onDateRangeChange(null, null);
    }
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Selecionar período';
    return `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`;
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<CalendarToday sx={{ fontSize: 18 }} />}
        onClick={handleClick}
        sx={{
          color: theme.palette.mode === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)',
          borderColor: 'var(--border-default)',
          backgroundColor: 'var(--bg-card)',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '6px 12px',
          '&:hover': {
            borderColor: 'var(--color-primary)',
            backgroundColor: 'var(--bg-hover)',
          }
        }}
      >
        {formatDateRange()}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: 'var(--bg-card)',
            borderRadius: 2,
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            marginTop: 1,
            minWidth: 400,
            color: 'var(--text-primary)',
          },
          // Calendário do MUI X DatePicker
          '& .MuiPickersDay-root': {
            color: 'var(--text-primary)',
            backgroundColor: 'transparent',
          },
          '& .MuiPickersDay-root.Mui-selected': {
            backgroundColor: 'var(--color-primary) !important',
            color: 'var(--text-inverse) !important',
          },
          '& .MuiPickersCalendarHeader-label': {
            color: 'var(--text-primary)',
          },
          '& .MuiPickersArrowSwitcher-button': {
            color: 'var(--text-primary)',
          },
          '& .MuiPickersDay-today': {
            borderColor: 'var(--color-primary)',
          },
          '& .MuiInputBase-root': {
            backgroundColor: 'var(--input-bg)',
            color: 'var(--input-text)',
          },
          '& .MuiInputLabel-root': {
            color: 'var(--text-secondary)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box className="flex items-center justify-between mb-3">
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Selecionar Período
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleClose}
              sx={{ color: 'var(--text-secondary)' }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Presets */}
          <Box className="mb-4">
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'var(--text-secondary)',
                fontWeight: 500,
                mb: 1,
                display: 'block'
              }}
            >
              Períodos Rápidos
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Chip
                  key={preset.value}
                  label={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  sx={theme => ({
                    backgroundColor: selectedPreset === preset.value
                      ? theme.palette.mode === 'dark'
                        ? 'var(--color-primary)'
                        : 'var(--color-primary)'
                      : theme.palette.mode === 'dark'
                        ? 'var(--bg-hover)'
                        : 'var(--bg-hover)',
                    color: selectedPreset === preset.value
                      ? theme.palette.mode === 'dark'
                        ? 'var(--text-inverse)'
                        : 'var(--text-inverse)'
                      : theme.palette.mode === 'dark'
                        ? 'var(--text-primary)'
                        : 'var(--text-primary)',
                    fontWeight: selectedPreset === preset.value ? 600 : 500,
                    '&:hover': {
                      backgroundColor: selectedPreset === preset.value
                        ? theme.palette.mode === 'dark'
                          ? 'var(--color-primary-hover)'
                          : 'var(--color-primary-hover)'
                        : theme.palette.mode === 'dark'
                          ? 'var(--bg-tertiary)'
                          : 'var(--bg-tertiary)',
                    }
                  })}
                />
              ))}
            </Box>
          </Box>

          {/* Custom Date Range */}
          <Box>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'var(--text-secondary)',
                fontWeight: 500,
                mb: 1,
                display: 'block'
              }}
            >
              Período Personalizado
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <Box className="flex gap-3 mb-3">
                <DatePicker
                  label="Data Início"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    setSelectedPreset('custom');
                    emitChange(newValue, endDate);
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'var(--input-bg)',
                          '& fieldset': {
                            borderColor: 'var(--input-border)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-secondary)',
                        },
                        '& .MuiInputBase-input': {
                          color: 'var(--text-primary)',
                        },
                        // Adaptação para dark/light
                        colorScheme: theme.palette.mode,
                      }
                    }
                  }}
                />
                <DatePicker
                  label="Data Fim"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                    setSelectedPreset('custom');
                    emitChange(startDate, newValue);
                  }}
                  format="DD/MM/YYYY"
                  minDate={startDate || undefined}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'var(--input-bg)',
                          '& fieldset': {
                            borderColor: 'var(--input-border)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--color-primary)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-secondary)',
                        },
                        '& .MuiInputBase-input': {
                          color: 'var(--text-primary)',
                        },
                        colorScheme: theme.palette.mode,
                      }
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>

          {/* Actions */}
          <Box className="flex gap-2 pt-3 border-t" sx={{ borderColor: 'var(--border-default)' }}>
            <Button
              variant="outlined"
              onClick={handleClearDates}
              fullWidth
              sx={{
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-default)',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'var(--color-danger)',
                  color: 'var(--color-danger)',
                }
              }}
            >
              Limpar
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              fullWidth
              sx={{
                backgroundColor: 'var(--color-primary)',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-hover)',
                }
              }}
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
