import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers';

export default function DatePicker(props: any) {
  const handleDateChange = (value: any, context: PickerChangeHandlerContext<DateValidationError>) => {
    props.onChange(new Date(value?.toString()));
    if (context.validationError) {
      props.onChange('');
      return;
    }
  }

  const pastYears = dayjs().subtract(props.minYears, 'years');

  return (
    <div className={props.className}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
        <DatePicker
          disabled={props.disabled}
          className={props.className}
          value={props.date}
          maxDate={pastYears}
          disablePast={props.disabledPast}
          disableFuture={props.disableFuture}
          label={props.label}
          slotProps={{ textField: { size: 'medium', required: props.required } }}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
    </div>
  );
}