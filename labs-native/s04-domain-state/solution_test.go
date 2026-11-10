package lab

import "testing"

func TestTransitions(t *testing.T) {
	o := Order{State: Pending}
	if e := o.Transition(Paid); e != nil {
		t.Fatal(e)
	}
	if e := o.Transition(Cancelled); e == nil || o.State != Paid {
		t.Fatal("invalid transition accepted")
	}
	if e := (&Order{State: "invalid"}).Transition(Paid); e == nil {
		t.Fatal("unknown state accepted")
	}
}
