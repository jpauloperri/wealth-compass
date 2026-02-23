import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BaseFieldProps {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type: "text" | "email" | "tel" | "number" | "currency";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

interface RadioFieldProps extends BaseFieldProps {
  type: "radio";
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

type FormFieldProps = TextFieldProps | TextareaFieldProps | SelectFieldProps | RadioFieldProps;

const FormField = (props: FormFieldProps) => {
  const { label, name, required, hint } = props;

  const formatCurrency = (val: string) => {
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(num) / 100);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {(props.type === "text" || props.type === "email" || props.type === "tel" || props.type === "number") && (
        <Input
          id={name}
          type={props.type === "number" ? "text" : props.type}
          inputMode={props.type === "number" ? "numeric" : undefined}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="bg-input border-border focus:ring-primary"
        />
      )}

      {props.type === "currency" && (
        <Input
          id={name}
          type="text"
          inputMode="numeric"
          value={props.value}
          onChange={(e) => props.onChange(formatCurrency(e.target.value))}
          placeholder="R$ 0,00"
          className="bg-input border-border focus:ring-primary"
        />
      )}

      {props.type === "textarea" && (
        <Textarea
          id={name}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="bg-input border-border focus:ring-primary min-h-[80px]"
        />
      )}

      {props.type === "select" && (
        <Select value={props.value} onValueChange={props.onChange}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {props.type === "radio" && (
        <RadioGroup value={props.value} onValueChange={props.onChange} className="flex flex-wrap gap-3">
          {props.options.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
              <Label htmlFor={`${name}-${opt.value}`} className="text-sm text-secondary-foreground cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default FormField;
