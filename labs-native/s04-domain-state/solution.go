package lab

import "errors"

type OrderState string

const (
	Pending   OrderState = "pending"
	Paid      OrderState = "paid"
	Cancelled OrderState = "cancelled"
)

type Order struct{ State OrderState }

func (o *Order) Transition(next OrderState) error {
	switch o.State {
	case Pending:
		if next != Paid && next != Cancelled {
			return errors.New("invalid transition")
		}
	case Paid:
		if next != Paid {
			return errors.New("paid order immutable")
		}
	case Cancelled:
		if next != Cancelled {
			return errors.New("cancelled order immutable")
		}
	default:
		return errors.New("unknown state")
	}
	o.State = next
	return nil
}
