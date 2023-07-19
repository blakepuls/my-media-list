import React, { useState } from "react";
import { BsAsterisk, BsExclamation } from "react-icons/bs";
import { IconType } from "react-icons/lib";
import Cleave from "cleave.js/react";
import { InitHandler } from "cleave.js/react/props";
import { ReactInstanceWithCleave } from "cleave.js/react/props";

interface UseInputProps {
  initialValue?: string;
  validator?: (value: string) => boolean;
}

export const useInput = ({ initialValue = "", validator }: UseInputProps) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    let willUpdate = true;
    if (typeof validator === "function") {
      willUpdate = validator(value);
    }

    if (willUpdate) {
      setValue(value);
    }
  };

  return {
    value,
    onChange,
  };
};

interface BaseInputProps {
  label: string;
  error?: string;
  width?: string;
  disabled?: boolean | string;
  className?: string;
  placeholder?: string;
  spellCheck?: boolean;
  locale?: boolean;
  required?: boolean;
  ref?: React.RefObject<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  pattern?: string;
  background?: string;
  icon?: IconType;
}

interface ParagraphInputProps extends BaseInputProps {
  type: "paragraph";
  value?: string;
  characterLimit?: number;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

interface TextInputProps extends BaseInputProps {
  type?: "text" | "password" | "email";
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

interface NumberInputProps extends BaseInputProps {
  type: "number";
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  onSubmit?: (value: number) => void;
}

interface BigIntInputProps extends BaseInputProps {
  type: "bigint";
  value?: bigint;
  min?: bigint;
  max?: bigint;
  onChange?: (value: bigint) => void;
  onSubmit?: (value: bigint) => void;
}

type InputProps =
  | TextInputProps
  | NumberInputProps
  | BigIntInputProps
  | ParagraphInputProps;

function Input(props: ParagraphInputProps): JSX.Element;
function Input(props: BigIntInputProps): JSX.Element;
function Input(props: TextInputProps): JSX.Element;
function Input(props: NumberInputProps): JSX.Element;
function Input(props: InputProps): JSX.Element {
  const ref = props.ref || React.useRef<HTMLInputElement>(null);
  const [cleave, setCleave] = React.useState<
    ReactInstanceWithCleave | undefined
  >();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!props.onChange) return;

    if (props.type === "number") {
      let value = parseFloat(
        e.target.value.replaceAll(",", "").replace("n", "")
      );
      if (value > Number.MAX_SAFE_INTEGER) {
        value = Number.MAX_SAFE_INTEGER;
      }
      props.onChange(value); // Here you should set the value
      return;
    }

    if (props.type === "bigint") {
      let value = BigInt(e.target.value.replaceAll(",", "").replace("n", ""));
      if (value > Number.MAX_SAFE_INTEGER) {
        value = BigInt(Number.MAX_SAFE_INTEGER);
      }
      props.onChange(value);
      return;
    }

    props.onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown?.(e);

    if (e.key === "Enter" && props.onSubmit) {
      e.preventDefault();
      if (props.type === "number") {
        props.onSubmit(parseFloat(e.currentTarget.value));
      } else if (props.type === "bigint") {
        props.onSubmit(BigInt(e.currentTarget.value));
      } else {
        props.onSubmit(e.currentTarget.value as never);
      }
    }
  };

  const handleInit = (cleave?: ReactInstanceWithCleave) => {
    setCleave(cleave);
  };

  if (props.type === "paragraph")
    return <ParagraphInput {...props} ref={ref as any} />;

  return (
    <div>
      <div className={props.label && "pb-1"}>
        {props.error ? (
          <div className="flex gap-1.5 items-center">
            <span className="text-red-500">{props.error}</span>
            {props.required && <BsAsterisk className="text-red-500 w-2" />}
          </div>
        ) : (
          <div className="flex gap-1.5 items-center">
            <span className="">{props.label}</span>
            {props.required && !props.value && (
              <BsAsterisk className="text-red-500 w-2" />
            )}
          </div>
        )}
      </div>

      {props.disabled ? (
        <div
          className={`flex items-center gap-0.5 p-3 px-1.5 ${
            props.background ?? "bg-gray-700"
          } rounded-md shadow-md relative ${
            props.error?.length && " outline-red-500 !text-red-500"
          } ${!props.spellCheck && "spellcheck-off"} ${props.width}`}
          onClick={() => ref.current?.focus()}
        >
          <input
            disabled={true}
            className={`ml-1 select-none outline-none bg-transparent text-gray-500 !${props.background} ${props.className} ${props.width} cursor-not-allowed w-full`}
            placeholder={props.placeholder}
            value={props.disabled === true ? "Disabled" : props.disabled}
            required={props.required}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            pattern={props.pattern}
            spellCheck={props.spellCheck}
          />
        </div>
      ) : (
        <div
          className={`flex items-center gap-0.5 p-3 px-1.5 ${
            props.background ?? "bg-gray-700"
          } rounded-md shadow-md relative ${
            props.error?.length && " outline-red-500 !text-red-500"
          } ${!props.spellCheck && "spellcheck-off"} ${props.width}`}
          onClick={() => ref.current?.focus()}
        >
          {props.icon && <props.icon className="text-xl text-gray-400 w-6" />}

          {props.type === "number" || props.type === "bigint" ? (
            <Cleave
              type="text" // Notice the type change here
              className={`overflow-hidden select-none outline-none bg-transparent ${
                !props.icon && "!pl-1"
              } !${props.background} ${props.className} ${props.width}`}
              placeholder={props.placeholder}
              options={{
                numeral: props.locale,
                // numeralThousandsGroupStyle: "thousand",
                // numeralPositiveOnly: true,
              }}
              value={props.value?.toString() ?? ""}
              required={props.required}
              onChange={handleChange}
              onInit={handleInit}
              onKeyDown={handleKeyDown}
              pattern={props.pattern}
            />
          ) : (
            <input
              type={props.type}
              className={`ml-1 select-none outline-none bg-transparent !${props.background} ${props.className} ${props.width}`}
              placeholder={props.placeholder}
              value={props.value}
              required={props.required}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              pattern={props.pattern}
              spellCheck={props.spellCheck}
            />
          )}
        </div>
      )}
    </div>
  );
}

const ParagraphInput = React.forwardRef<
  HTMLTextAreaElement,
  ParagraphInputProps
>(
  (
    {
      label,
      characterLimit,
      error,
      required,
      placeholder,
      value,
      onChange,
      width,
    },
    ref
  ) => {
    const [currentCount, setCurrentCount] = React.useState(value?.length || 0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (characterLimit && e.target.value.length > characterLimit) {
        return; // Ignore the change if it exceeds the character limit
      }
      setCurrentCount(e.target.value.length);
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`relative ${width}`}>
        {label && (
          <div className="pb-1">
            <div className="flex gap-1.5 items-center">
              <span className="">{label}</span>
              {required && !value && (
                <BsAsterisk className="text-red-500 w-2" />
              )}
            </div>
          </div>
        )}
        <textarea
          ref={ref}
          className={`bg-gray-700 rounded-md shadow-md p-3 outline-none resize-none ${width}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        {characterLimit && (
          <div
            className={`absolute bottom-2 right-2 text-xs ${
              currentCount >= characterLimit ? "text-red-500" : "text-gray-400"
            }`}
          >
            {currentCount}/{characterLimit}
          </div>
        )}
      </div>
    );
  }
);

export default Input;
